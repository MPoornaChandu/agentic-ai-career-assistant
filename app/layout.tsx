import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentic AI Career Assistant",
  description:
    "Analyze your resume, detect skill gaps, get internship recommendations, and build a 30-day roadmap with autonomous AI agents.",
  openGraph: {
    title: "Agentic AI Career Assistant",
    description: "Your personal AI-powered career coach for internship success.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentic AI Career Assistant"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
