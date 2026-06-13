import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ardor: {
          orange: "#e87425",
          "orange-dark": "#c45f1a",
          "orange-light": "#f5a05c",
          black: "#141414",
          "black-soft": "#1f1f1f",
          gray: "#2a2a2a",
          "gray-light": "#3d3d3d",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
};

export default config;
