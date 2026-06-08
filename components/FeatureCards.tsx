import {
  BriefcaseBusiness,
  ClipboardCheck,
  FileSearch,
  FolderGit2,
  Mail,
  Route
} from "lucide-react";

const features = [
  {
    title: "Resume Analysis",
    description: "Get a realistic score with clear feedback on structure, impact, and clarity.",
    icon: FileSearch
  },
  {
    title: "Skill Gap Detection",
    description: "Spot missing technical and professional skills for your target internship.",
    icon: ClipboardCheck
  },
  {
    title: "Internship Role Matching",
    description: "Discover beginner-friendly roles that match your current profile and goals.",
    icon: BriefcaseBusiness
  },
  {
    title: "Project Suggestions",
    description: "Build portfolio projects that show proof of skill instead of just claims.",
    icon: FolderGit2
  },
  {
    title: "Cover Letter Generator",
    description: "Create a concise, personalized cover letter tuned to your chosen role.",
    icon: Mail
  },
  {
    title: "30-Day Learning Roadmap",
    description: "Follow a week-wise plan that turns feedback into daily progress.",
    icon: Route
  }
];

export default function FeatureCards() {
  return (
    <section id="features" className="section-shell section-reveal scroll-mt-24">
      <div className="mb-10 max-w-3xl">
        <span className="section-kicker">Features</span>
        <h2 className="section-title">
          Everything a student needs to become <span className="logo-gradient">internship-ready.</span>
        </h2>
        <p className="section-copy">
          A focused MVP that feels like a premium AI workspace while staying simple, fast, and
          deployment-ready.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="glass-card glass-hover reveal-card group overflow-hidden rounded-lg p-6"
              style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
            >
              <span className="surface-line opacity-70 transition group-hover:opacity-100" />
              <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/15 to-accent/15 shadow-[0_0_20px_rgba(96,165,250,0.15)] transition group-hover:border-primary/40">
                <Icon className="size-6 text-cyan" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{feature.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
