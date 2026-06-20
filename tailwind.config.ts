import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Verdict / score bands (match the iOS app exactly)
        verdict: {
          green: "#16A34A",
          amber: "#F59E0B",
          orange: "#EA580C",
          red: "#DC2626",
        },
        // Dark theme tokens (from the in-app score screen)
        ink: {
          bg: "#0E0F12",
          raised: "#17181D",
          tile: "#1C1D23",
          hairline: "#2A2B33",
          text: "#F5F5F7",
          muted: "#9A9BA3",
          faint: "#6B6C75",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
