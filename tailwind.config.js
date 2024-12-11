/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        crimson: '#DC143C',
        primary: {
          light: '#42D7D1',
          DEFAULT: '#1CCDC7',
          dark: '#17ABA5'
        },
        secondary: {
          light: '#FF6161',
          DEFAULT: '#FF3939',
          dark: '#DD2C2C'
        },
        neutral: {
          50: '#F9F9F9',
          100: '#F2F2F2',
          200: '#E6E6E6',
          300: '#D1D1D1',
          400: '#BBBBBB',
          500: '#A5A5A5',
          600: '#8F8F8F',
          700: '#7A7A7A',
          800: '#646464',
          900: '#4F4F4F'
        }
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Fira Code', 'monospace']
      }
    }
  },
  plugins: [],
}



