export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-night/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-9 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-medium text-slate-200">Built for Agentic AI Hackathon</p>
          <p className="mt-1">Designed and developed by Poorna Chandu</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="#" className="transition hover:text-cyan">
            GitHub
          </a>
          <a href="#" className="transition hover:text-cyan">
            LinkedIn
          </a>
          <a href="#" className="transition hover:text-cyan">
            Portfolio
          </a>
        </div>
      </div>
    </footer>
  );
}
