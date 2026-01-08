/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#e4cffaff',
          700: '#4eaba3ff',
        },
        grayscale: {
          200: '#e6e6e6',
          400: '#c4c4c4',
          700: '#2b2b2b',
          800: '#1a1a1a',
          900: '#000',
        },
      },
      fontFamily: {
        manrope: ['Manrope'],
      },
    },
  },
  plugins: [],
};