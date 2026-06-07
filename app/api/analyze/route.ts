import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { AnalysisResult, AnalyzeRequest, Roadmap30Days } from "@/lib/types";

const MIN_WORDS = 50;
const MAX_WORDS = 2000;

const RATE_LIMIT_MESSAGE =
  "Gemini quota or rate limit was reached. Please wait a few minutes and try again with a shorter resume.";

const GEMINI_MODELS = ["gemini-2.0-flash-lite", "gemini-2.0-flash"] as const;

class ApiError extends Error {
  constructor(
    message: string,
    public readonly status = 500
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function stripMarkdownFences(value: string) {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
    : [];
}

function isStringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function normalizeRoadmap(value: unknown): Roadmap30Days {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    week1: stringArray(source.week1),
    week2: stringArray(source.week2),
    week3: stringArray(source.week3),
    week4: stringArray(source.week4)
  };
}

function normalizeAnalysis(value: unknown): AnalysisResult {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const rawScore = typeof source.resumeScore === "number" ? source.resumeScore : Number.NaN;

  return {
    resumeScore: Math.min(100, Math.max(0, Math.round(rawScore))),
    summary: typeof source.summary === "string" ? source.summary : "",
    strengths: stringArray(source.strengths),
    weaknesses: stringArray(source.weaknesses),
    missingSkills: stringArray(source.missingSkills),
    recommendedRoles: stringArray(source.recommendedRoles),
    suggestedProjects: stringArray(source.suggestedProjects),
    roadmap30Days: normalizeRoadmap(source.roadmap30Days),
    coverLetter: typeof source.coverLetter === "string" ? source.coverLetter : "",
    finalChecklist: stringArray(source.finalChecklist)
  };
}

function isValidAnalysisShape(value: unknown) {
  if (!value || typeof value !== "object") return false;

  const source = value as Record<string, unknown>;
  const roadmap = source.roadmap30Days;

  if (!roadmap || typeof roadmap !== "object") return false;

  const roadmapSource = roadmap as Record<string, unknown>;

  return (
    typeof source.resumeScore === "number" &&
    source.resumeScore >= 0 &&
    source.resumeScore <= 100 &&
    typeof source.summary === "string" &&
    isStringArray(source.strengths) &&
    isStringArray(source.weaknesses) &&
    isStringArray(source.missingSkills) &&
    isStringArray(source.recommendedRoles) &&
    isStringArray(source.suggestedProjects) &&
    isStringArray(roadmapSource.week1) &&
    isStringArray(roadmapSource.week2) &&
    isStringArray(roadmapSource.week3) &&
    isStringArray(roadmapSource.week4) &&
    typeof source.coverLetter === "string" &&
    isStringArray(source.finalChecklist)
  );
}

function parseAnalysisResponse(responseText: string) {
  const cleanedText = stripMarkdownFences(responseText);

  try {
    const parsed = JSON.parse(cleanedText);

    if (!isValidAnalysisShape(parsed)) {
      throw new ApiError("Gemini returned incomplete analysis JSON. Please try again.", 502);
    }

    return normalizeAnalysis(parsed);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Gemini returned invalid JSON. Please try again.", 502);
  }
}

function validateBody(body: Partial<AnalyzeRequest> | null) {
  if (!body || typeof body !== "object") return "Request body is required.";
  if (typeof body.resumeText !== "string" || !body.resumeText.trim()) return "Resume text is required.";
  if (typeof body.targetRole !== "string" || !body.targetRole.trim()) return "Target role is required.";

  const wordCount = countWords(body.resumeText);
  if (wordCount < MIN_WORDS) return "Resume too short - please paste more content.";
  if (wordCount > MAX_WORDS) return "Resume too long - please trim to 2000 words.";

  return null;
}

function buildPrompt({ resumeText, targetRole }: AnalyzeRequest) {
  return `Act as an Agentic AI Career Assistant using five agents: Resume Analyzer, Skill Gap, Internship Matcher, Project Advisor, and Roadmap Planner.
Analyze the resume for the target role. Return ONLY raw valid JSON, no markdown or code fences.

Required JSON:
{
  "resumeScore": number,
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "missingSkills": string[],
  "recommendedRoles": string[],
  "suggestedProjects": string[],
  "roadmap30Days": {
    "week1": string[],
    "week2": string[],
    "week3": string[],
    "week4": string[]
  },
  "coverLetter": string,
  "finalChecklist": string[]
}

Rules:
- resumeScore: 0-100, realistic and not inflated.
- Keep arrays concise: 3-6 useful items each.
- Focus on internships, beginner-friendly roles, employability, portfolio proof, and practical next steps.
- Make the roadmap week-wise and actionable.
- Keep the cover letter professional, concise, and personalized.

Target role: ${targetRole}
Resume:
${resumeText}`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown Gemini API error.";
}

function sanitizeErrorMessage(message: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? message.replaceAll(apiKey, "[redacted]") : message;
}

function getErrorStatus(error: unknown) {
  return typeof error === "object" && error !== null && "status" in error
    ? Number((error as { status?: unknown }).status)
    : undefined;
}

function isModelUnavailableError(error: unknown) {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error).toLowerCase();

  return (
    status === 404 ||
    status === 400 ||
    message.includes("not found") ||
    message.includes("not supported") ||
    message.includes("unavailable")
  );
}

function isRateLimitError(error: unknown) {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error).toLowerCase();

  return (
    status === 429 ||
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("resource_exhausted") ||
    message.includes("resource exhausted")
  );
}

function toClientGeminiError(error: unknown) {
  const message = sanitizeErrorMessage(getErrorMessage(error));
  const normalized = message.toLowerCase();

  if (normalized.includes("api key") || normalized.includes("permission") || normalized.includes("unauthorized")) {
    return "Gemini authentication failed. Check GEMINI_API_KEY in .env.local.";
  }

  if (isRateLimitError(error) || normalized.includes("quota") || normalized.includes("rate limit")) {
    return RATE_LIMIT_MESSAGE;
  }

  return `Gemini API request failed. ${message}`;
}

async function analyzeWithGemini(input: AnalyzeRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  console.info("[analyze] GEMINI_API_KEY configured:", Boolean(apiKey));

  if (!apiKey) {
    throw new ApiError("Gemini API key is not configured. Add GEMINI_API_KEY to .env.local.", 500);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildPrompt(input);

  for (let index = 0; index < GEMINI_MODELS.length; index += 1) {
    const modelName = GEMINI_MODELS[index];
    console.info("[analyze] selected Gemini model:", modelName);

    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          maxOutputTokens: 1200,
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (!text) {
        throw new ApiError("Gemini returned an empty response. Please try again.", 502);
      }

      return parseAnalysisResponse(text);
    } catch (error) {
      if (error instanceof ApiError) throw error;

      if (isRateLimitError(error)) {
        throw new ApiError(RATE_LIMIT_MESSAGE, 429);
      }

      const canTryFallback = index === 0 && isModelUnavailableError(error);
      if (canTryFallback) continue;

      throw new ApiError(toClientGeminiError(error), 502);
    }
  }

  throw new ApiError("Gemini Flash model is unavailable. Please try again later.", 502);
}

export async function POST(request: Request) {
  try {
    let body: Partial<AnalyzeRequest> | null = null;

    try {
      body = (await request.json()) as Partial<AnalyzeRequest>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    const validationError = validateBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const input = {
      resumeText: body.resumeText!.trim(),
      targetRole: body.targetRole!.trim()
    };

    try {
      const analysis = await analyzeWithGemini(input);
      return NextResponse.json(analysis);
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError("We could not analyze your resume. Please try again.", 500);
      return NextResponse.json({ error: apiError.message }, { status: apiError.status });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: sanitizeErrorMessage(message) }, { status: 500 });
  }
}
