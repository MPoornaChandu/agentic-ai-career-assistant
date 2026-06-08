"use client";

import type { CSSProperties } from "react";

const techStack = [
  { name: "Next.js", desc: "React framework for production", color: "#ffffff", glow: "rgba(255,255,255,0.2)" },
  { name: "TypeScript", desc: "Type-safe JavaScript", color: "#3B82F6", glow: "rgba(59,130,246,0.25)" },
  { name: "Tailwind CSS", desc: "Utility-first styling", color: "#22D3EE", glow: "rgba(34,211,238,0.25)" },
  { name: "Gemini API", desc: "Google's multimodal AI", color: "#8B5CF6", glow: "rgba(139,92,246,0.25)" },
  { name: "Agentic Workflow", desc: "5-agent AI pipeline", color: "#1D9E75", glow: "rgba(29,158,117,0.25)" },
  { name: "Vercel", desc: "Zero-config deployment", color: "#ffffff", glow: "rgba(255,255,255,0.2)" }
];

export default function TechStack() {
  return (
    <section
      id="tech-stack"
      className="section-shell section-reveal scroll-hidden scroll-mt-24 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(139,92,246,0.06)_0%,transparent_100%)]"
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
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className="glass-card cursor-default p-5 text-center transition-all duration-300 hover:-translate-y-2"
            style={
              {
                "--glow-color": tech.glow
              } as CSSProperties
            }
            onMouseEnter={(event) => {
              event.currentTarget.style.boxShadow = `0 0 30px ${tech.glow}, 0 0 0 1px ${tech.color}30`;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.boxShadow = "";
            }}
          >
            <p className="mb-1 font-semibold text-white">{tech.name}</p>
            <p className="text-xs" style={{ color: tech.color, opacity: 0.8 }}>
              {tech.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
