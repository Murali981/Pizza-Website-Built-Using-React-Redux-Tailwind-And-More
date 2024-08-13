/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: "Roboto Mono , monospace",
    },

    extend: {
      fontSize: {
        huge: ["80rem", { lineHeight: "1" }],
      },
      height: {
        screen: "100dvh", // dvh stands for dynamic view port height units
      },
    },
  },
  plugins: [],
};
