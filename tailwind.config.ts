import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#020408",
          900: "#030712",
          850: "#070E1E",
          800: "#0B1528",
          700: "#132238",
        },
        brand: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B", // Primary Devatrix Amber
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        cyber: {
          cyan: "#38BDF8",
          blue: "#0284C7",
          emerald: "#10B981",
          violet: "#8B5CF6",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "glow-slow": "glow 5s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { opacity: "0.4", filter: "drop-shadow(0 0 15px rgba(245, 158, 11, 0.2))" },
          "100%": { opacity: "0.8", filter: "drop-shadow(0 0 35px rgba(245, 158, 11, 0.5))" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
