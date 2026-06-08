import { ClipboardPaste, FileCheck2, SearchCheck } from "lucide-react";

const steps = [
  {
    title: "Paste Resume",
    description: "Drop in your resume text",
    icon: ClipboardPaste
  },
  {
    title: "AI Analyzes",
    description: "5 agents process your profile",
    icon: SearchCheck
  },
  {
    title: "Get Results",
    description: "Score, roadmap, cover letter and more",
    icon: FileCheck2
  }
];

export default function HowItWorks() {
  return (
    <section className="section-shell section-reveal pt-12">
      <div className="mb-10 text-center">
        <span className="section-kicker">How it works</span>
        <h2 className="section-title mx-auto max-w-3xl">
          From resume paste to <span className="logo-gradient">internship plan</span> in minutes.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article
              key={step.title}
              className="glass-card glass-hover reveal-card rounded-lg p-6"
              style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
            >
              <span className="surface-line" />
              <div className="mb-5 flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/15 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <Icon className="size-6 text-cyan" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{step.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
