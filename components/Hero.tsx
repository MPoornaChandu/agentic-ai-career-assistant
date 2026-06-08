"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BrainCircuit, Check } from "lucide-react";

function HeroCard() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = 82;
    const duration = 1500;
    const step = duration / target;
    const timer = window.setInterval(() => {
      start += 1;
      setScore(start);
      if (start >= target) window.clearInterval(timer);
    }, step);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(96,165,250,0.22) 0%, rgba(139,92,246,0.15) 50%, transparent 100%)",
          filter: "blur(40px)",
          transform: "scale(1.2)"
        }}
        aria-hidden="true"
      />

      <div className="glass-card mx-auto w-full max-w-sm p-6" style={{ animation: "cardFloat 6s ease-in-out infinite" }}>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Resume Analysis
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
            <span className="pulse-dot" style={{ width: 6, height: 6 }} />
            Live
          </span>
        </div>

        <div className="mb-5 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <svg width="72" height="72" viewBox="0 0 72 72" aria-label={`Resume score ${score} out of 100`}>
              <circle cx="36" cy="36" r="27" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
              <circle
                cx="36"
                cy="36"
                r="27"
                fill="none"
                stroke="#1D9E75"
                strokeWidth="7"
                strokeDasharray="169.6"
                strokeDashoffset={169.6 - (score / 100) * 169.6}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dashoffset 0.05s linear" }}
              />
              <text x="36" y="41" textAnchor="middle" fontSize="18" fontWeight="600" fill="#ffffff">
                {score}
              </text>
            </svg>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-white/50">Resume Score</p>
            <p className="text-2xl font-bold text-white">
              {score}
              <span className="text-sm font-normal text-white/40">/100</span>
            </p>
            <p className="mt-0.5 text-xs text-emerald-400">Good standing</p>
          </div>
        </div>

        <div className="mb-4 h-px bg-white/[0.08]" />

        <div className="mb-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-white/50">Missing Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {["React", "FastAPI", "GitHub", "REST APIs"].map((skill) => (
              <span key={skill} className="pill pill-red px-2.5 py-0.5 text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-1 text-xs uppercase tracking-wide text-white/50">Recommended Role</p>
          <p className="text-sm font-semibold text-blue-400">AI Intern / Full Stack Intern</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2">
          <Check className="size-4 text-emerald-400" aria-hidden="true" />
          <span className="text-xs font-medium text-emerald-300">30-Day Roadmap Ready</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero-spotlight section-shell section-reveal scroll-hidden flex min-h-[88vh] items-center pb-16 pt-16 lg:pb-20 lg:pt-24">
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
                className="glass-card reveal-card px-3 py-3 text-center"
                style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
              >
                <span className="surface-line" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <HeroCard />
      </div>
    </section>
  );
}
