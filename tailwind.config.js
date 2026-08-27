/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2B9361",
          "green-dark": "#227a4f",
          "green-light": "#E9F4EE",
          bg: "#FAF8F4",
          "bg-alt": "#F7F5F1",
          charcoal: "#1A1D1F",
          dark: "#1A1D1F",
          muted: "#6F767E",
          border: "#EFEFEF",
        },
      },
      fontFamily: {
        dm: ["'DM Sans'", "Inter", "system-ui", "sans-serif"],
        inter: ["Inter", "'DM Sans'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
    },
  },
  plugins: [],
};
