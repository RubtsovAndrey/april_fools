/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dodo: {
          brown: '#3D2B1F',
          beige: '#D4C5A9',
          navy: '#1B1F3B',
          orange: '#C47B35',
          olive: '#5A6B3C',
          red: '#A63D2F',
          gray: '#4A5568',
        }
      },
      fontFamily: {
        serif: ['"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
