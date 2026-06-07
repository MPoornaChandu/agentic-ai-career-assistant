import { AGENTS } from "@/lib/constants";
import { ArrowDown, ArrowRight, Bot } from "lucide-react";

export default function AgentWorkflow() {
  return (
    <section id="agents" className="section-shell section-reveal scroll-mt-24">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <span className="section-kicker">Agents</span>
        <h2 className="section-title">Multi-Agent Career Workflow</h2>
        <p className="section-copy mx-auto">
          Five specialized AI agents working in sequence to deliver your personalized career plan.
        </p>
      </div>

      <div className="relative flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent lg:block" aria-hidden="true" />
        {AGENTS.map((agent, index) => (
          <div key={agent.name} className="contents">
            <article className="glass-card glass-hover group z-10 min-h-44 flex-1 rounded-lg p-5">
              <span className="surface-line opacity-60 transition group-hover:opacity-100" />
              <div className="mb-5 flex items-start justify-between gap-4">
                <span className="flex size-11 items-center justify-center rounded-lg border border-accent/20 bg-accent/15 shadow-[0_0_26px_rgba(139,92,246,0.08)]">
                  <Bot className="size-5 text-violet-200" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  Active
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{agent.purpose}</p>
            </article>
            {index < AGENTS.length - 1 ? (
              <div className="z-10 flex items-center justify-center text-cyan/70">
                <ArrowDown className="size-5 lg:hidden" aria-hidden="true" />
                <span className="hidden rounded-full border border-cyan/20 bg-night px-2 py-2 lg:block">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
