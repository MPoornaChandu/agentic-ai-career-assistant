"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Bot, FileText, RotateCcw, SendHorizontal, ShieldCheck } from "lucide-react";
import { AGENT_LOADING_MESSAGES, DEMO_ANALYSIS, DEMO_ANALYSIS_NOTICE } from "@/lib/constants";
import type { AnalysisResult } from "@/lib/types";
import ResultsDashboard from "./ResultsDashboard";
import SkeletonCards from "./SkeletonCards";

const MIN_WORDS = 50;
const MAX_WORDS = 2000;

function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function isStringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (!value || typeof value !== "object") return false;

  const source = value as Partial<AnalysisResult>;
  const roadmap = source.roadmap30Days;

  return (
    typeof source.resumeScore === "number" &&
    typeof source.summary === "string" &&
    isStringArray(source.strengths) &&
    isStringArray(source.weaknesses) &&
    isStringArray(source.missingSkills) &&
    isStringArray(source.recommendedRoles) &&
    isStringArray(source.suggestedProjects) &&
    Boolean(roadmap) &&
    isStringArray(roadmap?.week1) &&
    isStringArray(roadmap?.week2) &&
    isStringArray(roadmap?.week3) &&
    isStringArray(roadmap?.week4) &&
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
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [currentAgentMessage, setCurrentAgentMessage] = useState(AGENT_LOADING_MESSAGES[0]);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [showDemoButton, setShowDemoButton] = useState(false);
  const [isDemoAnalysis, setIsDemoAnalysis] = useState(false);

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const analyzerRef = useRef<HTMLElement | null>(null);
  const analyzeDisabled = loading || cooldownRemaining > 0;

  const wordCountTone = useMemo(() => {
    if (wordCount === 0) return "text-slate-400";
    if (wordCount < MIN_WORDS || wordCount > MAX_WORDS) return "text-[#E24B4A]";
    if (wordCount >= MIN_WORDS && wordCount <= MAX_WORDS) return "text-[#1D9E75]";
    return "text-slate-400";
  }, [wordCount]);

  useEffect(() => {
    if (!loading) {
      setCurrentAgentMessage(AGENT_LOADING_MESSAGES[0]);
      return;
    }

    let index = 0;
    setCurrentAgentMessage(AGENT_LOADING_MESSAGES[index]);
    const interval = window.setInterval(() => {
      index = (index + 1) % AGENT_LOADING_MESSAGES.length;
      setCurrentAgentMessage(AGENT_LOADING_MESSAGES[index]);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [loading]);

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

  function handleResumeChange(value: string) {
    setResumeText(value);
    setWordCount(countWords(value));
  }

  function resetAnalyzer() {
    setResumeText("");
    setTargetRole("");
    setWordCount(0);
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
        <div className="glass-card rounded-lg p-4 text-sm text-slate-300">
          <span className="surface-line" />
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/10">
              <ShieldCheck className="size-5 text-emerald-200" aria-hidden="true" />
            </span>
            <p>
              API calls stay server-side. Your key never appears in frontend code.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card overflow-hidden rounded-lg p-5 sm:p-7">
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
              onChange={(event) => handleResumeChange(event.target.value)}
              placeholder="Paste your resume text here..."
              className="premium-field mt-3 min-h-[220px] resize-y px-4 py-4 leading-6"
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-500">Recommended: detailed projects, skills, and education.</span>
              <span className={`text-xs ${wordCountTone}`}>
                {wordCount} / {MAX_WORDS} words
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
                className="premium-field mt-3 min-h-12 px-4"
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
        <div className="mt-8">
          <div className="glass-card flex items-center gap-3 rounded-lg p-4">
            <span className="surface-line" />
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10">
              <span className="ai-spinner" aria-hidden="true" />
            </span>
            <p key={currentAgentMessage} className="animate-fade-up text-sm font-medium text-slate-200">
              {currentAgentMessage}
            </p>
          </div>
          <SkeletonCards />
        </div>
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
