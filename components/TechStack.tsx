import { TECH_STACK } from "@/lib/constants";
import { Cpu, Layers3 } from "lucide-react";

export default function TechStack() {
  return (
    <section id="tech-stack" className="section-shell section-reveal scroll-mt-24">
      <div className="mb-10 max-w-3xl">
        <span className="section-kicker">Tech Stack</span>
        <h2 className="section-title">Built for a clean Vercel deployment.</h2>
        <p className="section-copy">
          A lightweight full-stack architecture with no login, no database, and no client-side API
          key exposure.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TECH_STACK.map((item, index) => (
          <article key={item} className="glass-card glass-hover rounded-lg p-5">
            <span className="surface-line opacity-60" />
            <div className="flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/12 text-primary">
                {index % 2 === 0 ? <Layers3 className="size-5" aria-hidden="true" /> : <Cpu className="size-5" aria-hidden="true" />}
              </span>
              <h3 className="text-lg font-semibold text-slate-50">{item}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
