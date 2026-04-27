/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', '"Times New Roman"', 'serif'],
      },
      colors: {
        museum: {
          cream: '#f5f0e8',
          beige: '#e0d5c0',
          gold: '#b8963e',
          dark: '#1a1a1a',
          gray: '#6b6b6b',
        }
      },
    },
  },
  plugins: [],
}
