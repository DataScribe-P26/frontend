/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from "tailwind-scrollbar";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 1s ease-out",
        "fade-out": "fadeOut 1s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      colors: {
        // Define custom colors for dark mode if needed
        dark: {
          primary: "#1a1a1a",
          secondary: "#2d2d2d",
          text: "#ffffff",
        },
      },
      backgroundColor: {
        dark: {
          primary: "var(--dark-primary)",
          secondary: "var(--dark-secondary)",
        },
      },
    },
  },
  plugins: [tailwindScrollbar],
};
