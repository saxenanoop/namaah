import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        saffron: "#C8601A",
        "saffron-light": "#FDF4EE",
        indigo: "#2E3A5C",
        "indigo-mid": "#4A5A82",
        "indigo-light": "#E8ECF5",
        gold: "#B8860B",
        "gold-light": "#FFF8E7",
        ivory: "#FDFCFA",
        "text-dark": "#1A1A2E",
        "text-muted": "#6B6B80",
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
