import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  FileText,
  Gauge,
  Map,
  Radar,
  Sparkles
} from "lucide-react";

const missingSkills = ["React", "FastAPI", "GitHub", "APIs"];

export default function Hero() {
  return (
    <section className="section-shell section-reveal flex min-h-[88vh] items-center pb-16 pt-16 lg:pb-20 lg:pt-24">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_0.98fr] xl:gap-16">
        <div className="max-w-4xl">
          <span className="section-kicker">
            <BrainCircuit className="mr-2 size-3.5" aria-hidden="true" />
            Multi-agent internship readiness
          </span>
          <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[1.02] text-slate-50 sm:text-6xl lg:text-7xl">
            Your Personal Agentic AI Career Assistant
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
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-xs text-slate-300 sm:text-sm">
            {["Resume score", "Skill gaps", "30-day plan"].map((item) => (
              <div key={item} className="glass-card rounded-lg px-3 py-3 text-center">
                <span className="surface-line" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-x-4 bottom-0 top-8 rounded-lg bg-cyan/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/25 via-accent/20 to-cyan/25 opacity-70 blur-xl" aria-hidden="true" />
          <div className="glass-card glass-hover relative overflow-hidden rounded-lg">
            <span className="surface-line" />
            <div className="relative aspect-[16/11]">
              <Image
                src="/hero-ai-career.png"
                alt="Futuristic AI resume analysis dashboard preview"
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/45 to-night/5" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100 backdrop-blur-xl sm:left-6 sm:top-6">
                <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
                Agents online
              </div>
              <div className="absolute right-4 top-4 hidden items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-medium text-cyan backdrop-blur-xl sm:right-6 sm:top-6 sm:flex">
                <Radar className="size-3.5" aria-hidden="true" />
                Live profile scan
              </div>
              <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/12 bg-night/72 p-4 shadow-[0_16px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:inset-x-6 sm:bottom-6 sm:p-6">
                <span className="surface-line" />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-sm text-slate-400">
                      <Sparkles className="size-4 text-cyan" aria-hidden="true" />
                      Resume Score
                    </p>
                    <p className="mt-1 text-4xl font-semibold text-emerald-300">82/100</p>
                  </div>
                  <div className="flex size-16 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/10 shadow-[0_0_32px_rgba(52,211,153,0.18)]">
                    <Gauge className="size-7 text-emerald-300" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="relative h-full w-[82%] overflow-hidden rounded-full bg-gradient-to-r from-emerald-300 via-cyan to-primary">
                    <span className="progress-shine absolute inset-y-0 left-0 w-1/3 bg-white/35 blur-sm" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
                    <div className="mb-2 flex items-center gap-2 text-slate-300">
                      <FileText className="size-4 text-primary" aria-hidden="true" />
                      Missing Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {missingSkills.map((skill) => (
                        <span key={skill} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
                    <div className="mb-2 flex items-center gap-2 text-slate-300">
                      <BadgeCheck className="size-4 text-cyan" aria-hidden="true" />
                      Recommended Role
                    </div>
                    <p className="font-medium text-slate-50">AI Intern / Full Stack Intern</p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-emerald-200">
                      <Map className="size-3.5" aria-hidden="true" />
                      30-Day Roadmap Ready
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
