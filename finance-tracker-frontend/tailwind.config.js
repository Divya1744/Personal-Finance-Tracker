/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4f46e5', // Indigo-600
        'secondary': '#10b981', // Emerald-500
        'income': '#10b981',
        'expense': '#ef4444',
      }
    },
  },
  plugins: [],
}