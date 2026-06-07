export type Roadmap30Days = {
  week1: string[];
  week2: string[];
  week3: string[];
  week4: string[];
};

export type AnalysisResult = {
  resumeScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  recommendedRoles: string[];
  suggestedProjects: string[];
  roadmap30Days: Roadmap30Days;
  coverLetter: string;
  finalChecklist: string[];
};

export type AnalyzeRequest = {
  resumeText: string;
  targetRole: string;
};
