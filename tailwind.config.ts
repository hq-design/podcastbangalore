import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#f7f5f0",
        elevated: "#ffffff",
        contrast: "#0f0f10",
        muted: "#6f6c66",
        accent: "#ff6435",
        border: "#e1ded6",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", ...fontFamily.sans],
        body: ["var(--font-inter)", ...fontFamily.sans],
      },
      boxShadow: {
        soft: "0 24px 60px rgba(15, 15, 16, 0.08)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
