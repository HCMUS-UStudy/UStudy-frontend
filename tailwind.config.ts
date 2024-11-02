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
        background: "#F9FBFC",
        hero: "#D5E9F6",
        foreground: "var(--foreground)",
        button_primary: "#0284c7", // sky-600
        highlight_text: "#075985", // sky-800
        secondary_text: "#808080",
        

      },
    },
  },
  plugins: [],
};
export default config;
