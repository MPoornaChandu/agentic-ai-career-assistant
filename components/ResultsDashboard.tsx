"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
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

type RoadmapLike = AnalysisResult["roadmap30Days"] | string[];

export type DashboardAnalysisResult = Omit<AnalysisResult, "roadmap30Days"> & {
  roadmap30Days: RoadmapLike;
};

type ResultsDashboardProps = {
  results: DashboardAnalysisResult;
  onReset: () => void;
  resetIcon?: ReactNode;
  notice?: string;
};

type Toast = {
  message: string;
  type: "success" | "error";
};

const cardDelays = [0, 80, 160, 240, 320, 400, 480, 560, 640, 720];

function clampScore(score: number) {
  if (!Number.isFinite(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function ToastView({ toast }: { toast: Toast | null }) {
  if (!toast) return null;

  return (
    <div className="toast-wrap" role="status">
      <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
        {toast.type === "success" ? (
          <CheckCircle2 className="size-4" aria-hidden="true" />
        ) : (
          <AlertTriangle className="size-4" aria-hidden="true" />
        )}
        {toast.message}
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const target = clampScore(score);
  const [displayScore, setDisplayScore] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let current = 0;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    const timer = window.setInterval(() => {
      current = Math.min(current + increment, target);
      setDisplayScore(Math.round(current));
      if (current >= target) window.clearInterval(timer);
    }, duration / steps);

    return () => window.clearInterval(timer);
  }, [target]);

  const offset = circumference - (displayScore / 100) * circumference;
  const color = target >= 75 ? "#1D9E75" : target >= 50 ? "#EF9F27" : "#E24B4A";
  const label = target >= 75 ? "Strong profile" : target >= 50 ? "Needs improvement" : "Major gaps detected";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label={`Resume score ${target} out of 100`}>
          <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
            style={{
              transition: "stroke-dashoffset 0.04s linear",
              filter: `drop-shadow(0 0 8px ${color}60)`
            }}
          />
          <text x="70" y="65" textAnchor="middle" fontSize="32" fontWeight="700" fill="#ffffff">
            {displayScore}
          </text>
          <text x="70" y="85" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.45)">
            out of 100
          </text>
        </svg>
      </div>
      <p className="text-sm font-medium" style={{ color }}>
        {label}
      </p>
    </div>
  );
}

function ScoreCard({ score }: { score: number }) {
  return (
    <article className="glass-card card-reveal relative overflow-hidden p-5" style={{ animationDelay: `${cardDelays[0]}ms` }}>
      <span className="surface-line" />
      <div id="confetti-container" className="pointer-events-none absolute inset-0 overflow-hidden" />
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Resume Score</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Profile signal</h3>
        </div>
        <span className="flex size-11 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10">
          <Gauge className="size-6 text-cyan" aria-hidden="true" />
        </span>
      </div>
      <ScoreRing score={score} />
    </article>
  );
}

function TextCard({
  title,
  icon,
  children,
  className = "",
  delayIndex
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  delayIndex: number;
}) {
  return (
    <article
      className={`glass-card card-reveal p-5 ${className}`}
      style={{ animationDelay: `${cardDelays[delayIndex] ?? 0}ms` }}
    >
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

function PillList({ items, tone }: { items: string[]; tone: "green" | "amber" | "red" | "blue" | "violet" }) {
  if (!items.length) {
    return <p className="text-sm text-slate-400">No items returned. Try another analysis.</p>;
  }

  return (
    <div className="flex flex-wrap">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className={`pill pill-${tone}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

function WeekList({ label, cls, titleCls, items }: { label: string; cls: string; titleCls: string; items: string[] }) {
  return (
    <div className={`week-block ${cls}`}>
      <p className={titleCls}>{label}</p>
      {items.length ? (
        <ol className="list-inside list-decimal space-y-1">
          {items.map((task, index) => (
            <li key={`${task}-${index}`} className="text-sm text-white/75">
              {task}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-white/45">No roadmap items returned.</p>
      )}
    </div>
  );
}

function Roadmap({ roadmap }: { roadmap: RoadmapLike }) {
  const isWeekly = roadmap && typeof roadmap === "object" && !Array.isArray(roadmap);
  const roadmapObject = isWeekly ? (roadmap as Partial<AnalysisResult["roadmap30Days"]>) : null;

  const weeks = roadmapObject
    ? [
        {
          label: "Week 1",
          key: "week1",
          cls: "week-block-1",
          titleCls: "week-title-1",
          items: Array.isArray(roadmapObject.week1) ? roadmapObject.week1 : []
        },
        {
          label: "Week 2",
          key: "week2",
          cls: "week-block-2",
          titleCls: "week-title-2",
          items: Array.isArray(roadmapObject.week2) ? roadmapObject.week2 : []
        },
        {
          label: "Week 3",
          key: "week3",
          cls: "week-block-3",
          titleCls: "week-title-3",
          items: Array.isArray(roadmapObject.week3) ? roadmapObject.week3 : []
        },
        {
          label: "Week 4",
          key: "week4",
          cls: "week-block-4",
          titleCls: "week-title-4",
          items: Array.isArray(roadmapObject.week4) ? roadmapObject.week4 : []
        }
      ]
    : null;

  if (weeks) {
    return (
      <div>
        {weeks.map((week) => (
          <WeekList key={week.key} label={week.label} cls={week.cls} titleCls={week.titleCls} items={week.items} />
        ))}
      </div>
    );
  }

  const flatItems = Array.isArray(roadmap) ? roadmap : [];
  const chunkSize = Math.ceil(flatItems.length / 4) || 1;
  const clsList = ["week-block-1", "week-block-2", "week-block-3", "week-block-4"];
  const titleClsList = ["week-title-1", "week-title-2", "week-title-3", "week-title-4"];

  return (
    <div>
      {[0, 1, 2, 3].map((weekIndex) => {
        const items = flatItems.slice(weekIndex * chunkSize, (weekIndex + 1) * chunkSize);
        return items.length > 0 ? (
          <WeekList
            key={weekIndex}
            label={`Week ${weekIndex + 1}`}
            cls={clsList[weekIndex]}
            titleCls={titleClsList[weekIndex]}
            items={items}
          />
        ) : null;
      })}
      {!flatItems.length ? <p className="text-sm text-slate-400">No roadmap items returned.</p> : null}
    </div>
  );
}

export default function ResultsDashboard({ results, onReset, resetIcon, notice }: ResultsDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  const projects = useMemo(
    () => results.suggestedProjects.filter((project) => project.trim().length > 0),
    [results.suggestedProjects]
  );

  useEffect(() => {
    setCheckedItems(new Array(results.finalChecklist.length).fill(false));
  }, [results.finalChecklist]);

  useEffect(() => {
    const safeScore = clampScore(results.resumeScore);
    if (safeScore < 80) return;

    const container = document.getElementById("confetti-container");
    if (!container) return;

    container.innerHTML = "";
    const colors = ["#60A5FA", "#8B5CF6", "#22D3EE", "#1D9E75", "#FCD34D"];
    for (let index = 0; index < 30; index += 1) {
      const dot = document.createElement("div");
      dot.style.cssText = `
        position: absolute;
        width: 8px; height: 8px;
        border-radius: 50%;
        background: ${colors[index % colors.length]};
        left: ${Math.random() * 100}%;
        top: 50%;
        pointer-events: none;
        animation: confettiFly ${0.8 + Math.random() * 0.8}s ease forwards;
        animation-delay: ${Math.random() * 0.4}s;
      `;
      container.appendChild(dot);
    }

    const timer = window.setTimeout(() => {
      container.innerHTML = "";
    }, 2000);

    return () => {
      window.clearTimeout(timer);
      container.innerHTML = "";
    };
  }, [results.resumeScore]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(results.coverLetter);
      setCopied(true);
      setToast({ type: "success", message: "Copied to clipboard!" });
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setToast({ type: "error", message: "Copy failed. Please try again." });
    }
  }

  function toggleItem(index: number) {
    setCheckedItems((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  function handleReset() {
    onReset();
    window.setTimeout(() => {
      document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
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
        <div className="glass-card mb-5 border-amber-300/20 bg-amber-300/10 p-4 text-sm font-medium text-amber-100">
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
          delayIndex={1}
        >
          <p className="text-sm leading-7 text-slate-300">{results.summary}</p>
        </TextCard>

        <TextCard title="Strengths" icon={<CheckCircle2 className="size-5" aria-hidden="true" />} delayIndex={2}>
          <PillList items={results.strengths} tone="green" />
        </TextCard>

        <TextCard title="Weaknesses" icon={<TriangleAlert className="size-5" aria-hidden="true" />} delayIndex={3}>
          <PillList items={results.weaknesses} tone="amber" />
        </TextCard>

        <TextCard title="Missing Skills" icon={<XCircle className="size-5" aria-hidden="true" />} delayIndex={4}>
          <PillList items={results.missingSkills} tone="red" />
        </TextCard>

        <TextCard
          title="Recommended Internship Roles"
          icon={<Target className="size-5" aria-hidden="true" />}
          className="lg:col-span-3"
          delayIndex={5}
        >
          <PillList items={results.recommendedRoles} tone="blue" />
        </TextCard>

        <TextCard
          title="Suggested Projects"
          icon={<Lightbulb className="size-5" aria-hidden="true" />}
          className="lg:col-span-3"
          delayIndex={6}
        >
          <PillList items={projects} tone="violet" />
        </TextCard>

        <TextCard
          title="30-Day Learning Roadmap"
          icon={<Route className="size-5" aria-hidden="true" />}
          className="lg:col-span-3"
          delayIndex={7}
        >
          <Roadmap roadmap={results.roadmap30Days} />
        </TextCard>

        <article className="glass-card card-reveal relative p-5 lg:col-span-2" style={{ animationDelay: `${cardDelays[8]}ms` }}>
          <span className="surface-line opacity-70" />
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10 text-cyan">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-semibold text-white">Cover Letter</h3>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!results.coverLetter}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                copied
                  ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-400"
                  : "border-white/15 bg-white/[0.05] text-white/60 hover:border-blue-400/30 hover:bg-blue-400/10 hover:text-blue-400"
              }`}
            >
              {copied ? <BadgeCheck className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="cover-scroll max-h-72 overflow-y-auto">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">
              {results.coverLetter || "No cover letter returned. Try another analysis."}
            </p>
          </div>
        </article>

        <TextCard title="Final Improvement Checklist" icon={<ListChecks className="size-5" aria-hidden="true" />} delayIndex={9}>
          {results.finalChecklist.length ? (
            <div className="space-y-2">
              {results.finalChecklist.map((item, index) => (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full cursor-pointer items-start gap-3 rounded-lg p-2 text-left transition-colors duration-200 hover:bg-white/[0.04]"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all duration-300 ${
                      checkedItems[index]
                        ? "border-emerald-400/50 bg-emerald-400/20"
                        : "border-white/20 bg-white/[0.04]"
                    }`}
                  >
                    {checkedItems[index] ? <Check className="size-3 text-emerald-400" aria-hidden="true" /> : null}
                  </span>
                  <span
                    className={`text-sm transition-all duration-300 ${
                      checkedItems[index] ? "text-white/35 line-through" : "text-white/75"
                    }`}
                  >
                    {item}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No checklist items returned.</p>
          )}
        </TextCard>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleReset}
          className="btn-shimmer mt-6 w-full rounded-2xl py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(96,165,250,0.3)]"
        >
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
}
