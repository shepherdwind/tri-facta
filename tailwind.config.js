/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4A90E2",
        background: "#F5F5F5",
        text: "#333333",
        accent: "#FF6B6B",
        success: "#4CAF50",
      },
    },
  },
  plugins: [],
};
