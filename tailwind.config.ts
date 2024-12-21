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
        primary: "#1e40af", // blue-800
        background: "#f1f5f9", // slate-50: #f8fafc, #f9fbfc, slate-100: #f1f5f9
        hero: "#dbeafe", // #D5E9F6, blue-100: #dbeafe
        foreground: "var(--foreground)",
        button_primary: "#2563eb", // sky-600: #2563eb, blue-600: #2563eb
        button_primary_dark: "#1e40af", // blue-800: #1e40af
        highlight_text: "#1e40af", // sky-800: #1e40af, blue-800: #1e40af
        secondary_text: "#808080",
        error: "#dc2626",
      },
      keyframes: {
        scale: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
        wiggle: {
          "0%": {
            "transform-origin": "bottom",
            transform: "rotate(0deg)",
          },
          "25%": {
            "transform-origin": "bottom left",
            transform: "rotate(-15deg)",
          },
          "50%": {
            "transform-origin": "bottom",
            transform: "rotate(0deg)",
          },
          "75%": {
            "transform-origin": "bottom right",
            transform: "rotate(15deg)",
          },
          "100%": {
            "transform-origin": "bottom",
            transform: "rotate(0deg)",
          },
        },
      },
      animation: {
        "scale-effect": "scale 1s linear infinite",
        "wiggle-effect": "wiggle 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
