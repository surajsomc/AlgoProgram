import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#000000",
          raised: "#0a0a0a",
          overlay: "#111111",
          border: "#1a1a1a",
          "border-light": "#2a2a2a",
        },
        accent: {
          DEFAULT: "#0099ff",
          light: "#33adff",
          dark: "#0077cc",
          glow: "rgba(0, 153, 255, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0, 153, 255, 0.2)" },
          "50%": { boxShadow: "0 0 24px rgba(0, 153, 255, 0.4)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out forwards",
        slideUp: "slideUp 0.4s ease-out forwards",
        glowPulse: "glowPulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
