"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Bot, FileText, RotateCcw, SendHorizontal, ShieldCheck } from "lucide-react";
import { AGENT_LOADING_MESSAGES, DEMO_ANALYSIS, DEMO_ANALYSIS_NOTICE } from "@/lib/constants";
import ResultsDashboard, { type DashboardAnalysisResult } from "./ResultsDashboard";

const MIN_WORDS = 50;
const MAX_WORDS = 2000;

function countWords(value: string) {
  return value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
}

function isStringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function hasRoadmapShape(value: unknown) {
  if (isStringArray(value)) return true;
  if (!value || typeof value !== "object") return false;

  const roadmap = value as {
    week1?: unknown;
    week2?: unknown;
    week3?: unknown;
    week4?: unknown;
  };

  return (
    isStringArray(roadmap.week1) &&
    isStringArray(roadmap.week2) &&
    isStringArray(roadmap.week3) &&
    isStringArray(roadmap.week4)
  );
}

function isAnalysisResult(value: unknown): value is DashboardAnalysisResult {
  if (!value || typeof value !== "object") return false;

  const source = value as Partial<DashboardAnalysisResult>;

  return (
    typeof source.resumeScore === "number" &&
    typeof source.summary === "string" &&
    isStringArray(source.strengths) &&
    isStringArray(source.weaknesses) &&
    isStringArray(source.missingSkills) &&
    isStringArray(source.recommendedRoles) &&
    isStringArray(source.suggestedProjects) &&
    hasRoadmapShape(source.roadmap30Days) &&
    typeof source.coverLetter === "string" &&
    isStringArray(source.finalChecklist)
  );
}

function getApiError(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("error" in payload)) return null;

  const error = (payload as { error?: unknown }).error;
  return typeof error === "string" ? error : "We could not analyze your resume. Please try again.";
}

function isRateLimitErrorMessage(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("quota") || normalized.includes("rate limit");
}

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DashboardAnalysisResult | null>(null);
  const [agentMsgIndex, setAgentMsgIndex] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [showDemoButton, setShowDemoButton] = useState(false);
  const [isDemoAnalysis, setIsDemoAnalysis] = useState(false);

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const analyzerRef = useRef<HTMLElement | null>(null);
  const analyzeDisabled = loading || cooldownRemaining > 0;
  const agentMessages = AGENT_LOADING_MESSAGES;

  const wordCount = useMemo(() => countWords(resumeText), [resumeText]);
  const wordCountColor = useMemo(() => {
    if (wordCount === 0) return "text-white/30";
    if (wordCount < MIN_WORDS || wordCount > MAX_WORDS) return "text-red-400";
    return "text-emerald-400";
  }, [wordCount]);

  useEffect(() => {
    if (!loading) {
      setAgentMsgIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setAgentMsgIndex((prev) => (prev + 1) % agentMessages.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [agentMessages.length, loading]);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = window.setTimeout(() => {
      setCooldownRemaining((remaining) => Math.max(0, remaining - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldownRemaining]);

  function validateForm() {
    if (!resumeText.trim()) return "Resume text is required.";
    if (wordCount < MIN_WORDS) return "Resume too short - please paste more content.";
    if (wordCount > MAX_WORDS) return "Resume too long - please trim to 2000 words.";
    if (!targetRole.trim()) return "Target role is required.";
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setShowDemoButton(false);
      return;
    }

    if (cooldownRemaining > 0) {
      setError("Please wait before trying again.");
      setShowDemoButton(false);
      return;
    }

    setCooldownRemaining(20);
    setLoading(true);
    setError(null);
    setResults(null);
    setShowDemoButton(false);
    setIsDemoAnalysis(false);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resumeText,
          targetRole
        })
      });

      const payload: unknown = await response.json().catch(() => null);
      const apiError = getApiError(payload);

      if (apiError) {
        throw new Error(apiError);
      }

      if (!response.ok) {
        throw new Error("We could not analyze your resume. Please try again.");
      }

      if (!isAnalysisResult(payload)) {
        throw new Error("Gemini returned an unexpected response. Please try again.");
      }

      setResults(payload);
      setIsDemoAnalysis(false);
      window.setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while analyzing your resume.";
      setError(message);
      setShowDemoButton(isRateLimitErrorMessage(message));
    } finally {
      setLoading(false);
    }
  }

  function resetAnalyzer() {
    setResumeText("");
    setTargetRole("");
    setError(null);
    setResults(null);
    setShowDemoButton(false);
    setIsDemoAnalysis(false);
    analyzerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showDemoAnalysis() {
    setResults(DEMO_ANALYSIS);
    setError(null);
    setShowDemoButton(false);
    setIsDemoAnalysis(true);
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  return (
    <section id="analyzer" ref={analyzerRef} className="section-shell section-reveal scroll-mt-24">
      <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
        <div className="max-w-3xl">
          <span className="section-kicker">Analyzer</span>
          <h2 className="section-title">Analyze your resume with Agentic AI.</h2>
          <p className="section-copy">
            Paste your resume, choose a target internship role, and let the five-agent workflow
            create a practical improvement plan.
          </p>
        </div>
        <div className="glass-card p-4 text-sm text-slate-300">
          <span className="surface-line" />
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/10">
              <ShieldCheck className="size-5 text-emerald-200" aria-hidden="true" />
            </span>
            <p>API calls stay server-side. Your key never appears in frontend code.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card overflow-hidden p-5 sm:p-7">
        <span className="surface-line" />
        <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10">
              <Bot className="size-5 text-cyan" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-100">Agentic Resume Console</p>
              <p className="text-xs text-slate-400">Five specialized agents, one focused report.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            Ready
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <FileText className="size-4 text-cyan" aria-hidden="true" />
              Resume text
            </span>
            <textarea
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              placeholder="Paste your resume text here..."
              className="premium-field mt-3 min-h-[220px] resize-y px-4 py-4 leading-6 transition-all duration-300 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/10"
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-500">Recommended: detailed projects, skills, and education.</span>
              <span className={`text-xs ${wordCountColor} transition-colors duration-300`}>
                {wordCount} / {MAX_WORDS} words
                {wordCount < MIN_WORDS && wordCount > 0 ? " - too short" : ""}
                {wordCount > MAX_WORDS ? " - too long" : ""}
              </span>
            </div>
          </label>

          <div className="flex flex-col gap-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-200">Target role</span>
              <input
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="e.g. AI Intern, Full Stack Developer, Data Analyst"
                className="premium-field mt-3 min-h-12 px-4 transition-all duration-300 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/10"
              />
            </label>

            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <p className="text-sm font-medium text-slate-100">Agent workflow</p>
              <div className="mt-3 space-y-2">
                {["Resume Analyzer", "Skill Gap", "Internship Matcher", "Project Advisor", "Roadmap Planner"].map(
                  (agent) => (
                    <div key={agent} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="size-1.5 rounded-full bg-cyan shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                      {agent}
                    </div>
                  )
                )}
              </div>
            </div>

            <button type="submit" disabled={analyzeDisabled} className="primary-button w-full">
              {loading ? (
                <span className="ai-spinner" aria-hidden="true" />
              ) : (
                <SendHorizontal className="size-4" aria-hidden="true" />
              )}
              {loading
                ? "Analyzing..."
                : cooldownRemaining > 0
                  ? "Please wait before trying again."
                  : "Analyze with Agentic AI"}
            </button>
            {cooldownRemaining > 0 && !loading ? (
              <p className="text-center text-xs text-slate-400">
                Please wait before trying again. {cooldownRemaining}s remaining.
              </p>
            ) : null}
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100 shadow-[0_0_30px_rgba(248,113,113,0.08)]"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
            <button type="submit" disabled={analyzeDisabled} className="secondary-button mt-4 border-red-300/20 bg-red-300/10 text-red-100 hover:border-red-300/40 hover:bg-red-300/15">
              Retry
            </button>
            {showDemoButton ? (
              <button type="button" onClick={showDemoAnalysis} className="secondary-button mt-4 border-amber-300/20 bg-amber-300/10 text-amber-100 hover:border-amber-300/40 hover:bg-amber-300/15">
                View Demo Analysis
              </button>
            ) : null}
          </div>
        ) : null}
      </form>

      {loading ? (
        <>
          <div className="mt-4 space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <div
                className="h-4 w-4 rounded-full border-2 border-blue-400/30 border-t-blue-400"
                style={{ animation: "spin 0.8s linear infinite" }}
                aria-hidden="true"
              />
              <p
                className="text-sm text-blue-300 transition-all duration-500"
                key={agentMsgIndex}
                style={{ animation: "cardReveal 0.4s ease forwards" }}
              >
                {agentMessages[agentMsgIndex]}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="skeleton"
                style={{
                  height: 120,
                  animationDelay: `${index * 0.2}s`
                }}
              />
            ))}
          </div>
        </>
      ) : null}

      <div ref={resultsRef} className="scroll-mt-24">
        {results ? (
          <ResultsDashboard
            results={results}
            onReset={resetAnalyzer}
            resetIcon={<RotateCcw className="size-4" aria-hidden="true" />}
            notice={isDemoAnalysis ? DEMO_ANALYSIS_NOTICE : undefined}
          />
        ) : null}
      </div>
    </section>
  );
}
