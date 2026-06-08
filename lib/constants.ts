import type { AnalysisResult } from "./types";

export const AGENT_LOADING_MESSAGES = [
  "Resume Analyzer Agent is reading your resume...",
  "Skill Gap Agent is detecting missing skills...",
  "Internship Matcher Agent is finding the best roles...",
  "Project Advisor Agent is crafting suggestions...",
  "Roadmap Planner Agent is building your 30-day plan..."
];

export const AGENTS = [
  {
    name: "Resume Analyzer",
    purpose: "Scores structure, clarity, impact, and role fit."
  },
  {
    name: "Skill Gap",
    purpose: "Finds missing skills for the target internship."
  },
  {
    name: "Internship Matcher",
    purpose: "Maps your profile to realistic beginner roles."
  },
  {
    name: "Project Advisor",
    purpose: "Suggests portfolio projects that prove capability."
  },
  {
    name: "Roadmap Planner",
    purpose: "Turns feedback into a focused 30-day plan."
  }
];

export const TECH_STACK = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Gemini API",
  "Agentic Workflow",
  "Vercel"
];

export const DEMO_ANALYSIS_NOTICE = "Demo Analysis — Gemini quota limit reached";

export const DEMO_ANALYSIS: AnalysisResult = {
  resumeScore: 78,
  summary:
    "This resume shows strong beginner potential for AI and full-stack internships, but needs stronger project proof, clearer technical skills, and measurable achievements.",
  strengths: ["AI interest", "Web development basics", "GitHub usage", "Project mindset"],
  weaknesses: ["Needs deployed project links", "Limited measurable achievements", "Missing backend depth"],
  missingSkills: ["FastAPI", "APIs", "TypeScript", "Database basics", "Deployment"],
  recommendedRoles: ["AI Intern", "Full Stack Intern", "Frontend Developer Intern"],
  suggestedProjects: [
    "Agentic AI Career Assistant",
    "AI Hotel Booking Assistant",
    "AI Code Review Agent"
  ],
  roadmap30Days: {
    week1: ["Improve resume structure", "Learn TypeScript basics", "Push clean GitHub repos"],
    week2: ["Build API routes", "Integrate Gemini API", "Deploy one project"],
    week3: ["Add database basics", "Build dashboard UI", "Write README documentation"],
    week4: ["Polish portfolio", "Apply to internships", "Prepare project demo video"]
  },
  coverLetter:
    "Dear Hiring Team,\n\nI am excited to apply for the AI Intern role. I have been building a strong foundation in web development, GitHub-based project work, and practical AI integrations, and I am eager to contribute to a team where I can learn quickly while delivering useful features. My recent work on agentic AI and full-stack projects has helped me understand how to connect clean user experiences with real AI workflows.\n\nI would welcome the opportunity to bring my curiosity, project mindset, and growing technical skills to your internship program.\n\nSincerely,\nPoorna Chandu",
  finalChecklist: [
    "Add live project links",
    "Add GitHub README",
    "Mention tech stack clearly",
    "Add measurable impact"
  ]
};
