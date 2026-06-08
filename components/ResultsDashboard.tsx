"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  CheckCircle2,
  Copy,
  Gauge,
  Lightbulb,
  ListChecks,
  Mail,
  Route,
  Sparkles,
  Target,
  TriangleAlert,
  XCircle
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

type ResultsDashboardProps = {
  results: AnalysisResult;
  onReset: () => void;
  resetIcon?: ReactNode;
  notice?: string;
};

type Toast = {
  message: string;
  type: "success" | "error";
};

const radius = 54;
const circumference = 2 * Math.PI * radius;
const confettiColors = ["#60A5FA", "#8B5CF6", "#22D3EE", "#1D9E75", "#EF9F27"];

function clampScore(score: number) {
  if (!Number.isFinite(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let animationFrame = 0;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * progress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    }

    setValue(0);
    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [duration, target]);

  return value;
}

function ToastView({ toast }: { toast: Toast | null }) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      role="status"
      className={`toast-enter fixed right-4 top-24 z-[60] flex max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:right-8 ${
        isSuccess
          ? "border-emerald-300/25 bg-emerald-300/[0.12] text-emerald-100"
          : "border-red-300/25 bg-red-300/[0.12] text-red-100"
      }`}
    >
      {isSuccess ? <CheckCircle2 className="size-5" aria-hidden="true" /> : <AlertTriangle className="size-5" aria-hidden="true" />}
      {toast.message}
    </div>
  );
}

function ScoreCard({ score }: { score: number }) {
  const safeScore = clampScore(score);
  const count = useCountUp(safeScore);
  const [ringReady, setRingReady] = useState(false);
  const offset = circumference - (safeScore / 100) * circumference;
  const tone =
    safeScore >= 75
      ? { color: "#1D9E75", label: "Strong", text: "text-emerald-200" }
      : safeScore >= 50
        ? { color: "#EF9F27", label: "Needs polish", text: "text-amber-200" }
        : { color: "#E24B4A", label: "Needs work", text: "text-red-200" };

  useEffect(() => {
    const timer = window.setTimeout(() => setRingReady(true), 80);
    return () => window.clearTimeout(timer);
  }, [safeScore]);

  return (
    <article className="glass-card result-reveal relative overflow-hidden rounded-lg p-6">
      <span className="surface-line" />
      {safeScore >= 80 ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, index) => (
            <span
              key={index}
              className="score-confetti-piece"
              style={
                {
                  left: `${45 + ((index % 7) - 3) * 4}%`,
                  top: `${36 + Math.floor(index / 7) * 4}%`,
                  "--x": `${Math.cos(index) * (46 + (index % 5) * 12)}px`,
                  "--y": `${Math.sin(index) * (46 + (index % 6) * 10)}px`,
                  "--d": `${index * 0.025}s`,
                  "--c": confettiColors[index % confettiColors.length]
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Resume Score</p>
          <h3 className="mt-1 text-2xl font-semibold text-white">{tone.label}</h3>
        </div>
        <span className="flex size-11 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10">
          <Gauge className="size-6 text-cyan" aria-hidden="true" />
        </span>
      </div>

      <div className="relative mx-auto size-44">
        <svg viewBox="0 0 140 140" className="size-full -rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={tone.color}
            strokeLinecap="round"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={ringReady ? offset : circumference}
            className="transition-[stroke-dashoffset] duration-[1500ms] ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-semibold text-white">{count}</span>
          <span className={`mt-1 text-sm ${tone.text}`}>out of 100</span>
        </div>
      </div>
    </article>
  );
}

function TextCard({
  title,
  icon,
  children,
  className = "",
  delay = 0
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <article className={`glass-card result-reveal rounded-lg p-6 ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <span className="surface-line opacity-70" />
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10 text-cyan">
          {icon}
        </span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </article>
  );
}

function ChipList({
  items,
  tone = "blue",
  clickable = false
}: {
  items: string[];
  tone?: "green" | "amber" | "red" | "blue";
  clickable?: boolean;
}) {
  const toneClass = {
    green: "border-[#1D9E75]/25 bg-[#1D9E75]/[0.12] text-emerald-300",
    amber: "border-[#EF9F27]/25 bg-[#EF9F27]/[0.12] text-yellow-300",
    red: "border-[#E24B4A]/25 bg-[#E24B4A]/[0.12] text-red-200",
    blue: "border-primary/25 bg-primary/[0.12] text-blue-300"
  }[tone];

  if (!items.length) {
    return <p className="text-sm text-slate-400">No items returned. Try another analysis.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) =>
        clickable ? (
          <button
            type="button"
            key={item}
            className={`rounded-full border px-3 py-1.5 text-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:-translate-y-0.5 ${toneClass}`}
          >
            {item}
          </button>
        ) : (
          <span key={item} className={`rounded-full border px-3 py-1.5 text-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${toneClass}`}>
            {item}
          </span>
        )
      )}
    </div>
  );
}

function Roadmap({ roadmap }: { roadmap: AnalysisResult["roadmap30Days"] }) {
  const weeks = [
    ["Week 1", roadmap.week1, "#60A5FA"],
    ["Week 2", roadmap.week2, "#8B5CF6"],
    ["Week 3", roadmap.week3, "#22D3EE"],
    ["Week 4", roadmap.week4, "#1D9E75"]
  ] as const;

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {weeks.map(([label, items, color]) => (
        <div
          key={label}
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4"
          style={{ borderLeft: `3px solid ${color}` }}
        >
          <p className="mb-3 font-semibold" style={{ color }}>
            {label}
          </p>
          {items.length ? (
            <ol className="space-y-2 text-sm leading-6 text-slate-300">
              {items.map((item, index) => (
                <li key={item} className="flex gap-2">
                  <span className="font-semibold" style={{ color }}>
                    {index + 1}.
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-400">No roadmap items returned.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ResultsDashboard({ results, onReset, resetIcon, notice }: ResultsDashboardProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [toast, setToast] = useState<Toast | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const projects = useMemo(
    () => results.suggestedProjects.filter((project) => project.trim().length > 0),
    [results.suggestedProjects]
  );

  useEffect(() => {
    setCheckedItems(new Set());
  }, [results.finalChecklist]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function toggleChecklistItem(item: string) {
    setCheckedItems((current) => {
      const next = new Set(current);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  }

  async function copyCoverLetter() {
    if (!results.coverLetter) return;

    try {
      await navigator.clipboard.writeText(results.coverLetter);
      setCopyStatus("copied");
      setToast({ type: "success", message: "Copied to clipboard!" });
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("failed");
      setToast({ type: "error", message: "Copy failed. Please try again." });
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }

  return (
    <div className="mt-12">
      <ToastView toast={toast} />

      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="section-kicker">Results</span>
          <h2 className="section-title">
            Your personalized <span className="logo-gradient">career dashboard.</span>
          </h2>
        </div>
        <button type="button" onClick={onReset} className="secondary-button sm:self-center">
          {resetIcon}
          Analyze Another Resume
        </button>
      </div>

      {notice ? (
        <div className="glass-card mb-5 rounded-lg border-amber-300/20 bg-amber-300/10 p-4 text-sm font-medium text-amber-100">
          <span className="surface-line opacity-60" />
          {notice}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <ScoreCard score={results.resumeScore} />

        <TextCard
          title="AI Summary"
          icon={<Sparkles className="size-5" aria-hidden="true" />}
          className="lg:col-span-2"
          delay={80}
        >
          <p className="text-sm leading-7 text-slate-300">{results.summary}</p>
        </TextCard>

        <TextCard title="Strengths" icon={<CheckCircle2 className="size-5" aria-hidden="true" />} delay={160}>
          <ChipList items={results.strengths} tone="green" />
        </TextCard>

        <TextCard title="Weaknesses" icon={<TriangleAlert className="size-5" aria-hidden="true" />} delay={240}>
          <ChipList items={results.weaknesses} tone="amber" />
        </TextCard>

        <TextCard title="Missing Skills" icon={<XCircle className="size-5" aria-hidden="true" />} delay={320}>
          <ChipList items={results.missingSkills} tone="red" />
        </TextCard>

        <TextCard
          title="Recommended Internship Roles"
          icon={<Target className="size-5" aria-hidden="true" />}
          className="lg:col-span-3"
          delay={400}
        >
          <ChipList items={results.recommendedRoles} tone="blue" clickable />
        </TextCard>

        <TextCard title="Suggested Projects" icon={<Lightbulb className="size-5" aria-hidden="true" />} className="lg:col-span-3" delay={480}>
          {projects.length ? (
            <ol className="grid gap-3 md:grid-cols-2">
              {projects.map((project, index) => (
                <li key={project} className="rounded-lg border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
                  <span className="mr-2 font-semibold text-cyan">{index + 1}.</span>
                  {project}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-400">No project suggestions returned.</p>
          )}
        </TextCard>

        <TextCard title="30-Day Learning Roadmap" icon={<Route className="size-5" aria-hidden="true" />} className="lg:col-span-3" delay={560}>
          <Roadmap roadmap={results.roadmap30Days} />
        </TextCard>

        <TextCard title="Cover Letter" icon={<Mail className="size-5" aria-hidden="true" />} className="lg:col-span-2" delay={640}>
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={copyCoverLetter}
                disabled={!results.coverLetter}
                className={`secondary-button min-h-9 px-3 py-2 text-xs ${
                  copyStatus === "copied" ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : ""
                }`}
              >
                {copyStatus === "copied" ? (
                  <BadgeCheck className="size-4" aria-hidden="true" />
                ) : (
                  <Copy className="size-4" aria-hidden="true" />
                )}
                {copyStatus === "copied" ? "Copied! ✓" : "Copy to Clipboard"}
              </button>
            </div>
            <div className="custom-scrollbar max-h-[300px] overflow-y-auto pr-2">
              <p className="whitespace-pre-wrap text-sm leading-8 text-slate-300">
                {results.coverLetter || "No cover letter returned. Try another analysis."}
              </p>
            </div>
          </div>
        </TextCard>

        <TextCard title="Final Improvement Checklist" icon={<ListChecks className="size-5" aria-hidden="true" />} delay={720}>
          {results.finalChecklist.length ? (
            <ul className="space-y-3">
              {results.finalChecklist.map((item) => {
                const checked = checkedItems.has(item);

                return (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => toggleChecklistItem(item)}
                      className="flex w-full gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-left text-sm leading-6 text-slate-300 transition hover:border-cyan/25 hover:bg-white/[0.06]"
                    >
                      <span
                        className={`mt-1 flex size-4 shrink-0 items-center justify-center rounded border transition ${
                          checked ? "border-emerald-300 bg-emerald-300 text-night" : "border-white/25 bg-white/[0.03]"
                        }`}
                      >
                        {checked ? <Check className="size-3" aria-hidden="true" /> : null}
                      </span>
                      <span className={`transition ${checked ? "text-slate-500 line-through" : ""}`}>{item}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">No checklist items returned.</p>
          )}
        </TextCard>
      </div>

      <div className="mt-8">
        <button type="button" onClick={onReset} className="primary-button shine-button w-full">
          {resetIcon}
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
}
