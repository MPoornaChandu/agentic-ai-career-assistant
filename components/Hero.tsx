"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, BrainCircuit, Check, FileText, Radar } from "lucide-react";

const missingSkills = ["React", "FastAPI", "GitHub", "REST APIs"];
const targetScore = 82;
const radius = 54;
const circumference = 2 * Math.PI * radius;

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

    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [duration, target]);

  return value;
}

function HeroDashboardPreview() {
  const score = useCountUp(targetScore);
  const offset = circumference - (targetScore / 100) * circumference;

  return (
    <div className="relative mx-auto max-w-xl">
      <div
        className="absolute -inset-[10%] -z-10 rounded-[32px] bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(96,165,250,0.2)_0%,transparent_70%)] blur-[40px]"
        aria-hidden="true"
      />
      <div className="floating-dashboard rounded-[20px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[20px]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Live preview</p>
            <h3 className="mt-1 text-lg font-semibold text-white">Agentic Career Scan</h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-medium text-cyan">
            <Radar className="size-3.5" aria-hidden="true" />
            Active
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-center gap-5">
            <div className="relative size-32 shrink-0">
              <svg viewBox="0 0 140 140" className="size-full -rotate-90">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="10"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#1D9E75"
                  strokeLinecap="round"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={
                    {
                      "--circumference": circumference,
                      "--offset": offset,
                      animation: "countRing 1.5s ease forwards"
                    } as React.CSSProperties
                  }
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold text-white">{score}</span>
                <span className="text-xs text-emerald-200">/100</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400">Resume Score</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-300">82/100</p>
              <p className="mt-2 max-w-[15rem] text-sm leading-6 text-slate-300">
                Strong beginner signal with clear next steps.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
            <FileText className="size-4 text-red-200" aria-hidden="true" />
            Missing Skills
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-red-400/30 bg-red-500/15 px-2.5 py-1 text-xs text-red-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Recommended Role</p>
              <p className="mt-1 font-semibold text-primary">AI Intern / Full Stack Intern</p>
            </div>
            <BadgeCheck className="size-5 shrink-0 text-cyan" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-100">
          <span className="active-dot" aria-hidden="true" />
          <Check className="size-4" aria-hidden="true" />
          30-Day Roadmap Ready
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero-spotlight section-shell section-reveal flex min-h-[88vh] items-center pb-16 pt-16 lg:pb-20 lg:pt-24">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_0.98fr] xl:gap-16">
        <div className="max-w-4xl">
          <span className="section-kicker">
            <BrainCircuit className="mr-2 size-3.5" aria-hidden="true" />
            Multi-agent internship readiness
          </span>
          <h1 className="max-w-5xl text-balance text-4xl font-semibold leading-[1.04] text-slate-50 min-[380px]:text-5xl sm:text-6xl lg:text-7xl">
            Your Personal <span className="animated-gradient-text">Agentic AI</span> Career Assistant
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Analyze your resume, discover skill gaps, find internship roles, generate cover
            letters, and build a 30-day roadmap with autonomous AI agents.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#analyzer" className="primary-button">
              Start Resume Analysis
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a href="#agents" className="secondary-button">
              View Agent Workflow
            </a>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 text-xs text-slate-300 min-[380px]:grid-cols-3 sm:text-sm">
            {["Resume score", "Skill gaps", "30-day plan"].map((item, index) => (
              <div
                key={item}
                className="glass-card reveal-card rounded-lg px-3 py-3 text-center"
                style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
              >
                <span className="surface-line" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <HeroDashboardPreview />
      </div>
    </section>
  );
}
