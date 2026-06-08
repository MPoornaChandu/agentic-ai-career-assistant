import { GitBranch, Globe, Network } from "lucide-react";

const links = [
  { label: "GitHub", href: "#", icon: GitBranch },
  { label: "LinkedIn", href: "#", icon: Network },
  { label: "Portfolio", href: "#", icon: Globe }
];

export default function Footer() {
  return (
    <footer className="relative z-10 bg-night/70 backdrop-blur-xl">
      <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(96,165,250,0.4),rgba(139,92,246,0.4),transparent)]" />
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-7 px-4 py-10 text-sm text-slate-400 sm:px-6 lg:px-8">
        <a href="#" className="logo-gradient text-lg font-semibold tracking-wide">
          Agentic Career
        </a>

        <div className="flex flex-wrap justify-center gap-3">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                <Icon className="size-4" aria-hidden="true" />
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-2 text-center text-[13px] text-slate-400 sm:flex-row">
          <span>Built for Agentic AI Hackathon</span>
          <span className="hidden text-slate-600 sm:inline">·</span>
          <span>Designed &amp; developed by Poorna Chandu</span>
        </div>
      </div>
    </footer>
  );
}
