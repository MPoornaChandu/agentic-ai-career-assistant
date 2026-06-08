import AgentWorkflow from "@/components/AgentWorkflow";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";
import ScrollEnhancements from "@/components/ScrollEnhancements";
import TechStack from "@/components/TechStack";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="ambient-mesh" aria-hidden="true" />
      <div className="blob blob-blue" aria-hidden="true" />
      <div className="blob blob-violet" aria-hidden="true" />
      <div className="blob blob-cyan" aria-hidden="true" />
      <div className="blob blob-purple" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />
      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <HowItWorks />
        <FeatureCards />
        <AgentWorkflow />
        <ResumeAnalyzer />
        <TechStack />
      </main>
      <Footer />
      <ScrollEnhancements />
    </div>
  );
}
