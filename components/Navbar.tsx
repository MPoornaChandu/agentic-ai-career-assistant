"use client";

import { useEffect } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "Agents", href: "#agents" },
  { label: "Analyzer", href: "#analyzer" },
  { label: "Tech Stack", href: "#tech-stack" }
];

export default function Navbar() {
  useEffect(() => {
    const btn = document.getElementById("backToTop");
    const onScroll = () => {
      if (!btn) return;
      if (window.scrollY > 400) btn.classList.add("visible");
      else btn.classList.remove("visible");
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".scroll-hidden").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <div className="blob blob-3" aria-hidden="true" />
      <div className="blob blob-4" aria-hidden="true" />

      <button
        id="backToTop"
        type="button"
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp className="size-5" aria-hidden="true" />
      </button>

      <header className="sticky left-0 right-0 top-0 z-50 border-b border-white/10 bg-night/55 shadow-[0_10px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="group flex items-center gap-2 text-sm font-semibold text-slate-50">
            <span className="flex size-9 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10 shadow-glow transition duration-300 group-hover:border-cyan/60 group-hover:bg-cyan/15">
              <Sparkles className="size-4 text-cyan" aria-hidden="true" />
            </span>
            <span className="gradient-text font-bold text-xl">Agentic Career</span>
          </a>

          <div className="hidden items-center rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition duration-300 hover:bg-white/[0.07] hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#analyzer"
            className="primary-button min-h-10 px-4 py-2 text-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(96,165,250,0.4),0_0_40px_rgba(139,92,246,0.2)] sm:text-sm"
          >
            Analyze Resume
          </a>
        </nav>
      </header>
    </>
  );
}
