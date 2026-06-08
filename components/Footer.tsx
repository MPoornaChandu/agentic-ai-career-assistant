import { GitBranch, Globe, Network } from "lucide-react";

const links = [
  {
    label: "GitHub",
    href: "https://github.com/MPoornaChandu/agentic-ai-career-assistant",
    icon: GitBranch
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/poorna-chandu-938119379/",
    icon: Network
  },
  {
    label: "Portfolio",
    href: "https://agentic-ai-career-assistant.vercel.app/",
    icon: Globe
  }
];

export default function Footer() {
  return (
    <footer className="relative z-10 bg-night/70 px-4 pb-10 pt-10 backdrop-blur-xl sm:px-6 lg:px-8">
      <div
        className="mb-10 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(96,165,250,0.4), rgba(139,92,246,0.4), transparent)"
        }}
        aria-hidden="true"
      />

      <div className="mb-6 text-center">
        <span className="gradient-text font-bold text-xl">Agentic Career</span>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center text-sm text-slate-400">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-3">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-28 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-blue-400/10 hover:text-blue-400 sm:min-w-0"
              >
                <Icon className="size-4" aria-hidden="true" />
                {link.label}
              </a>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          Built for Agentic AI Hackathon &middot; Designed &amp; developed by Poorna Chandu
        </p>
      </div>
    </footer>
  );
}
