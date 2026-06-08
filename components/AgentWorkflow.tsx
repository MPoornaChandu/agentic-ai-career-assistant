import { AGENTS } from "@/lib/constants";
import { ArrowDown, Bot } from "lucide-react";

export default function AgentWorkflow() {
  return (
    <section
      id="agents"
      className="section-shell section-reveal scroll-hidden scroll-mt-24 bg-[linear-gradient(90deg,transparent,rgba(96,165,250,0.04),rgba(139,92,246,0.04),transparent)]"
    >
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <span className="section-kicker">Agents</span>
        <h2 className="section-title">
          Multi-Agent <span className="logo-gradient">Career Workflow</span>
        </h2>
        <p className="section-copy mx-auto">
          Five specialized AI agents working in sequence to deliver your personalized career plan.
        </p>
      </div>

      <div className="relative flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        <div
          className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent lg:block"
          aria-hidden="true"
        />
        {AGENTS.map((agent, index) => (
          <div key={agent.name} className="contents">
            <article
              className="glass-card glass-hover reveal-card group z-10 min-h-44 flex-1 p-5"
              style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
            >
              <span className="surface-line opacity-60 transition group-hover:opacity-100" />
              <div className="mb-5 flex items-start justify-between gap-4">
                <span className="flex size-11 items-center justify-center rounded-lg border border-accent/20 bg-accent/15 shadow-[0_0_26px_rgba(139,92,246,0.08)]">
                  <Bot className="size-5 text-violet-200" aria-hidden="true" />
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                  <span className="pulse-dot" />
                  Active
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{agent.purpose}</p>
            </article>

            {index < AGENTS.length - 1 ? (
              <div className="z-10 flex items-center justify-center text-cyan/70">
                <ArrowDown className="size-5 lg:hidden" aria-hidden="true" />
                <div className="mx-1 hidden items-center justify-center lg:flex" aria-hidden="true">
                  <span
                    className="inline-block text-xl font-bold text-blue-400"
                    style={{ animation: "flowPulse 2s ease-in-out infinite" }}
                  >
                    {"\u2192"}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
