/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          50: "#f5f7fb",
          100: "#e9edf6",
          200: "#cfd8e8",
          300: "#a8b6d4",
          400: "#6f83b6",
          500: "#4a5c9b",
          600: "#3a487e",
          700: "#313c67",
          800: "#2b3356",
          900: "#262c49",
          950: "#161824"
        }
      },
      boxShadow: {
        card: "0 10px 40px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};
