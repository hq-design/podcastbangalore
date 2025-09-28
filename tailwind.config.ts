import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class", "[data-theme='dark']"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#05030f",
        primary: "#9b87f5",
        accent: {
          blue: "#4cc9f0",
          green: "#f6c344",
        },
        text: {
          primary: "#f8f7ff",
          muted: "#b8b2cc",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        display: ["var(--font-poppins)", ...fontFamily.sans],
        mono: ["var(--font-jetbrains)", ...fontFamily.mono],
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at 18% 18%, rgba(155,135,245,0.38), transparent 55%), radial-gradient(circle at 78% 28%, rgba(76,201,240,0.32), transparent 60%)",
        "glass": "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
      },
      boxShadow: {
        neon: "0 0 35px rgba(155,135,245,0.35)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "0.9", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        hue: {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(20deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        shimmer: "shimmer 8s ease-in-out infinite",
        hue: "hue 6s ease-in-out infinite alternate",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
