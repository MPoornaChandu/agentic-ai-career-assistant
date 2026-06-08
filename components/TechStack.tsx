const techItems = [
  {
    name: "Next.js",
    letter: "N",
    description: "React framework for production",
    color: "#F8FAFC",
    glow: "rgba(248,250,252,0.22)"
  },
  {
    name: "TypeScript",
    letter: "TS",
    description: "Type-safe JavaScript",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.25)"
  },
  {
    name: "Tailwind CSS",
    letter: "T",
    description: "Utility-first styling",
    color: "#22D3EE",
    glow: "rgba(34,211,238,0.25)"
  },
  {
    name: "Gemini API",
    letter: "G",
    description: "Google's multimodal AI",
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.25)"
  },
  {
    name: "Agentic Workflow",
    letter: "A",
    description: "5-agent AI pipeline",
    color: "#1D9E75",
    glow: "rgba(29,158,117,0.25)"
  },
  {
    name: "Vercel",
    letter: "V",
    description: "Zero-config deployment",
    color: "#CBD5E1",
    glow: "rgba(203,213,225,0.2)"
  }
];

export default function TechStack() {
  return (
    <section
      id="tech-stack"
      className="section-shell section-reveal scroll-mt-24 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(139,92,246,0.06)_0%,transparent_100%)]"
    >
      <div className="mb-10 max-w-3xl">
        <span className="section-kicker">Tech Stack</span>
        <h2 className="section-title">
          Built for a clean <span className="logo-gradient">Vercel deployment.</span>
        </h2>
        <p className="section-copy">
          A lightweight full-stack architecture with no login, no database, and no client-side API
          key exposure.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {techItems.map((item, index) => (
          <article
            key={item.name}
            className="tech-card glass-card glass-hover reveal-card rounded-lg p-6"
            style={{ "--reveal-delay": `${index * 80}ms`, "--tech-glow": item.glow } as React.CSSProperties}
          >
            <span className="surface-line opacity-60" />
            <div
              className="mb-5 flex size-14 items-center justify-center rounded-2xl border bg-white/[0.04] text-lg font-bold"
              style={{ color: item.color, borderColor: `${item.color}44`, boxShadow: `0 0 24px ${item.glow}` }}
            >
              {item.letter}
            </div>
            <h3 className="text-lg font-semibold text-slate-50">{item.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
