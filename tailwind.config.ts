import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#020617",
        primary: "#60A5FA",
        accent: "#8B5CF6",
        cyan: "#22D3EE",
        muted: "#94A3B8"
      },
      boxShadow: {
        glow: "0 0 40px rgba(96, 165, 250, 0.22)",
        violet: "0 0 50px rgba(139, 92, 246, 0.2)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.58", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.02)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.7s ease both",
        shimmer: "shimmer 2.4s linear infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
