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
        cream: "#FFF8F0",
        saffron: {
          DEFAULT: "#FF9933",
          dark: "#E67E22",
          deep: "#D35400",
          light: "#FFF3E0",
        },
        teal: {
          DEFAULT: "#138D75",
          dark: "#117A65",
          light: "#E8F8F5",
        },
        charcoal: {
          DEFAULT: "#2C3E50",
          muted: "#5D6D7E",
          light: "#85929E",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Playfair Display", "serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        devanagari: ["var(--font-devanagari)", "Noto Sans Devanagari", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(44, 62, 80, 0.06)",
        card: "0 6px 24px -4px rgba(44, 62, 80, 0.08)",
        hover: "0 12px 32px -4px rgba(255, 153, 51, 0.15)",
        drawer: "-8px 0 32px rgba(44, 62, 80, 0.15)",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};

export default config;

