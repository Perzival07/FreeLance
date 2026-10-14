/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm paper backgrounds
        cream: {
          50: '#FFFDF9',
          100: '#FAF6EF',
          200: '#F3ECE0',
          300: '#E7DCCB',
          400: '#D6C7AF',
        },
        // Brand accent (antique gold / brass)
        gold: {
          50: '#fbf6e9',
          100: '#f5ead0',
          200: '#ecd8a3',
          300: '#e0c073',
          400: '#d4a94e',
          500: '#C9A24B',
          600: '#ad8636',
          700: '#8a6a2b',
          800: '#6b5122',
          900: '#4f3c1a',
        },
        // Dark bands (top bar, footer)
        ink: {
          700: '#2a2520',
          800: '#1f1b17',
          900: '#171411',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      maxWidth: {
        site: '1320px',
      },
      keyframes: {
        heroIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
      },
    },
  },
  plugins: [],
}
