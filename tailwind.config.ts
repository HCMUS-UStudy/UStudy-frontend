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
        // primary: "#2563eb", // blue-600
        primary: "BEE5D1",
        // "primary-dark": "#1e40af", // blue-800
        "primary-dark": "#95BFA9", 

        neutral: "#d1d5db", // gray-300

        background: "#f1f5f9", // slate-50: #f8fafc, #f9fbfc, slate-100: #f1f5f9
        hero: "#dbeafe", // #D5E9F6, blue-100: #dbeafe
        foreground: "var(--foreground)",

        "disabled-dark": "#9ca3af", // gray-400
        "disabled-light": "#d1d5db", // gray-300

        "button-primary": "#2563eb", // sky-600: #2563eb, blue-600: #2563eb
        "button-primary-dark": "#1e40af", // blue-800: #1e40af

        "highlight-text": "#1e40af", // sky-800: #1e40af, blue-800: #1e40af
        "primary-text": "var(--color-text-primary)",
        "secondary-text": "#808080",

        popover: "#ffffff",
        "control-border": "#9ca3af", // gray-400
        "control-hover": "#bfdbfe", // blue-200
        "control-placeholder": "#4b5563", // gray-600
        // "control-ring": "#3b82f6", // blue-500
        "control-ring": "#BEE5D1",

        success: "#22c55e", // green-500
        error: "#dc2626",
      },
      keyframes: {
        scale: {
          '0%': { transform: 'scale(1)'},
          '50%': {transform: 'scale(1.3)'},
          '100%': {transform: 'scale(1)'}
        },
        fall: {
          '0%': { transform: 'translateY(0vh)' },
          '50%': { transform: 'translateY(50vh)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        wiggle: {
          '0%': {
            'transform-origin': 'bottom',
            transform: 'rotate(0deg)'
          },
          '25%': {
            'transform-origin': 'bottom left',
            transform: 'rotate(-15deg)'
          },
          '50%': {
            'transform-origin': 'bottom',
            transform: 'rotate(0deg)'
          },
          '75%': {
            'transform-origin': 'bottom right',
            transform: 'rotate(15deg)'
          },
          '100%': {
            'transform-origin': 'bottom',
            transform: 'rotate(0deg)'
          }
        }
       
      },
      animation: {
        'scale-effect': 'scale 1s linear infinite',
        'wiggle-effect': 'wiggle 1.5s linear infinite',
        fall_1: 'fall 2.5s linear 0s infinite',
        fall_2: 'fall 3s linear 1s infinite',
        fall_3: 'fall 2.5s linear 2s infinite',
        fall_4: 'fall 3s linear 1.5s infinite',
        fall_5: 'fall 3s linear 2.5s infinite',
      }
    },
  },
  plugins: [],
};
export default config;
