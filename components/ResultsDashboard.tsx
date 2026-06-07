"use client";

import { ReactNode, useMemo, useState } from "react";
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  Clipboard,
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

const confettiColors = ["#60A5FA", "#8B5CF6", "#22D3EE", "#34D399", "#FBBF24"];

function clampScore(score: number) {
  if (!Number.isFinite(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function ScoreCard({ score }: { score: number }) {
  const safeScore = clampScore(score);
  const tone =
    safeScore >= 75
      ? { color: "#34D399", label: "Strong", text: "text-emerald-200" }
      : safeScore >= 50
        ? { color: "#FBBF24", label: "Needs polish", text: "text-amber-200" }
        : { color: "#F87171", label: "Needs work", text: "text-red-200" };

  return (
    <article className="glass-card relative overflow-hidden rounded-lg p-6">
      <span className="surface-line" />
      {safeScore >= 80 ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 22 }).map((_, index) => (
            <span
              key={index}
              className="confetti-piece"
              style={
                {
                  left: `${5 + ((index * 43) % 90)}%`,
                  "--x": `${(index % 2 === 0 ? 1 : -1) * (24 + (index % 5) * 13)}px`,
                  "--d": `${index * 0.035}s`,
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
      <div
        className="mx-auto flex size-40 items-center justify-center rounded-full p-3 shadow-[0_0_50px_rgba(34,211,238,0.08)]"
        style={{
          background: `conic-gradient(${tone.color} ${safeScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
        }}
      >
        <div className="flex size-full flex-col items-center justify-center rounded-full border border-white/10 bg-night">
          <span className="text-5xl font-semibold text-white">{safeScore}</span>
          <span className={`mt-1 text-sm ${tone.text}`}>out of 100</span>
        </div>
      </div>
      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-center text-sm text-slate-300">
        {safeScore >= 75
          ? "Strong foundation. Focus on proof and polish."
          : safeScore >= 50
            ? "Good start. Fill gaps with targeted projects."
            : "Start with core skills, structure, and evidence."}
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
    <article className={`glass-card animate-fade-up rounded-lg p-6 ${className}`} style={{ animationDelay: `${delay}ms` }}>
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
    green: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
    amber: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    red: "border-red-300/20 bg-red-300/10 text-red-100",
    blue: "border-cyan/20 bg-cyan/10 text-cyan"
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
            className={`rounded-full border px-3 py-1.5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:-translate-y-0.5 ${toneClass}`}
          >
            {item}
          </button>
        ) : (
          <span key={item} className={`rounded-full border px-3 py-1.5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${toneClass}`}>
            {item}
          </span>
        )
      )}
    </div>
  );
}

function Roadmap({ roadmap }: { roadmap: AnalysisResult["roadmap30Days"] }) {
  const weeks = [
    ["Week 1", roadmap.week1],
    ["Week 2", roadmap.week2],
    ["Week 3", roadmap.week3],
    ["Week 4", roadmap.week4]
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {weeks.map(([label, items]) => (
        <div key={label} className="rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="mb-3 flex items-center gap-2 font-semibold text-slate-100">
            <span className="size-2 rounded-full bg-cyan shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
            {label}
          </p>
          {items.length ? (
            <ul className="space-y-2 text-sm leading-6 text-slate-300">
              {items.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-1 size-4 shrink-0 text-cyan" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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

  const projects = useMemo(
    () => results.suggestedProjects.filter((project) => project.trim().length > 0),
    [results.suggestedProjects]
  );

  async function copyCoverLetter() {
    if (!results.coverLetter) return;

    try {
      await navigator.clipboard.writeText(results.coverLetter);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    }
  }

  return (
    <div className="mt-12">
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="section-kicker">Results</span>
          <h2 className="section-title">Your personalized career dashboard.</h2>
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
        <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
          <ScoreCard score={results.resumeScore} />
        </div>

        <TextCard
          title="AI Summary"
          icon={<Sparkles className="size-5" aria-hidden="true" />}
          className="lg:col-span-2"
          delay={80}
        >
          <p className="text-sm leading-7 text-slate-300">{results.summary}</p>
        </TextCard>

        <TextCard title="Strengths" icon={<CheckCircle2 className="size-5" aria-hidden="true" />} delay={140}>
          <ChipList items={results.strengths} tone="green" />
        </TextCard>

        <TextCard title="Weaknesses" icon={<TriangleAlert className="size-5" aria-hidden="true" />} delay={200}>
          <ChipList items={results.weaknesses} tone="amber" />
        </TextCard>

        <TextCard title="Missing Skills" icon={<XCircle className="size-5" aria-hidden="true" />} delay={260}>
          <ChipList items={results.missingSkills} tone="red" />
        </TextCard>

        <TextCard
          title="Recommended Internship Roles"
          icon={<Target className="size-5" aria-hidden="true" />}
          className="lg:col-span-3"
          delay={320}
        >
          <ChipList items={results.recommendedRoles} tone="blue" clickable />
        </TextCard>

        <TextCard title="Suggested Projects" icon={<Lightbulb className="size-5" aria-hidden="true" />} className="lg:col-span-3" delay={380}>
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

        <TextCard title="30-Day Learning Roadmap" icon={<Route className="size-5" aria-hidden="true" />} className="lg:col-span-3" delay={440}>
          <Roadmap roadmap={results.roadmap30Days} />
        </TextCard>

        <TextCard title="Cover Letter" icon={<Mail className="size-5" aria-hidden="true" />} className="lg:col-span-2" delay={500}>
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {results.coverLetter || "No cover letter returned. Try another analysis."}
            </p>
          </div>
          <button type="button" onClick={copyCoverLetter} disabled={!results.coverLetter} className="secondary-button mt-4">
            {copyStatus === "copied" ? (
              <BadgeCheck className="size-4 text-emerald-200" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copyStatus === "copied" ? "Copied" : copyStatus === "failed" ? "Copy failed" : "Copy to Clipboard"}
          </button>
        </TextCard>

        <TextCard title="Final Improvement Checklist" icon={<ListChecks className="size-5" aria-hidden="true" />} delay={560}>
          {results.finalChecklist.length ? (
            <ul className="space-y-3">
              {results.finalChecklist.map((item) => (
                <li key={item} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-300">
                  <Clipboard className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">No checklist items returned.</p>
          )}
        </TextCard>
      </div>

      <div className="mt-8 flex justify-center">
        <button type="button" onClick={onReset} className="primary-button">
          {resetIcon}
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
}
