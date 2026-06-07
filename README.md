# Agentic AI Career Assistant

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vercel](https://img.shields.io/badge/Vercel-ready-black?logo=vercel)

Agentic AI Career Assistant is a full-stack AI web application that uses a multi-agent workflow to analyze resumes, detect skill gaps, recommend internship roles, suggest projects, generate cover letters, and create a personalized 30-day learning roadmap - powered by Google Gemini and built with Next.js 14.

## Features

- Resume scoring with honest, constructive feedback
- Skill gap detection for a selected target role
- Internship role recommendations for beginner-friendly positions
- Portfolio project suggestions
- Personalized cover letter generation with copy-to-clipboard
- Week-wise 30-day learning roadmap
- Loading skeleton cards and animated agent status messages
- Responsive Apple-inspired glassmorphism interface
- Server-only Gemini API calls through `app/api/analyze/route.ts`
- No login, no database, no payments, and no admin panel

## Agent Architecture

Resume Analyzer Agent -> Skill Gap Agent -> Internship Matcher Agent -> Project Advisor Agent -> Roadmap Planner Agent

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Google Gemini API via `@google/generative-ai` |
| Deployment | Vercel |
| Architecture | Server API route plus client-side React state |

## Screenshots

Add production screenshots after deployment:

- Hero and workflow preview
- Resume analyzer form
- Results dashboard
- Mobile layout

## Local Setup

1. Clone the repo.
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local`:

```bash
cp .env.example .env.local
```

4. Add your Gemini API key:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

5. Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Server-side API key used only by the Next.js API route. |
| `GEMINI_MODEL` | No | Optional override for the Gemini model. Defaults to the stable Flash fallback chain. |

## API Route

`POST /api/analyze`

```json
{
  "resumeText": "string",
  "targetRole": "string"
}
```

The API validates input, calls Gemini from the server, strips accidental markdown fences, parses JSON safely, and returns a structured fallback response if the model call fails.

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add `GEMINI_API_KEY` in Project Settings -> Environment Variables.
4. Deploy.

The app is Vercel-ready and keeps the API key out of the browser bundle.

## Future Improvements

- PDF resume upload and parsing
- Export results as PDF
- Role-specific benchmark rubrics
- Saved analysis history with authentication
- GitHub profile analysis
- Interview question generation
