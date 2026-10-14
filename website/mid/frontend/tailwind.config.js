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
        // Antique gold — primary luxury accent (replaces old saddle-brown accent everywhere)
        primary: {
          DEFAULT: '#C9A24B',
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
        // Near-black ink — luxury dark canvas
        ink: {
          50: '#f3f2f1',
          100: '#e2ddd8',
          200: '#3a332e',
          300: '#272220',
          400: '#1c1916',
          500: '#161311',
          600: '#141210',
          700: '#100e0c',
          800: '#0d0b09',
          900: '#0a0908',
          950: '#070605',
        },
        // Warm ivory — luxury text on dark
        ivory: {
          50: '#FFFDF9',
          100: '#FBF7EF',
          200: '#F5EFE6',
          300: '#E8DFCF',
          400: '#D3C6AE',
          500: '#B7A688',
          600: '#8f8064',
        },
        accent: {
          DEFAULT: '#B08D57', // Aged brass - secondary metallic accent
          light: '#D4B483',
          dark: '#8a6a2b',
        },
        // Jewel-tone accents — used sparingly next to gold for a more flamboyant feel
        ruby: {
          300: '#f78fb3',
          400: '#f0508a',
          500: '#e0245e',
          600: '#b81a4b',
        },
        amethyst: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#6d3fd6',
        },
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        kenburns: {
          '0%': { transform: 'scale(1.04) translate3d(0, 0, 0)' },
          '100%': { transform: 'scale(1.16) translate3d(-1.5%, -1%, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -18px, 0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 32px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(201,162,75,0.35), 0 8px 30px -8px rgba(201,162,75,0.35)' },
          '50%': { boxShadow: '0 0 0 1px rgba(224,36,94,0.45), 0 10px 40px -6px rgba(224,36,94,0.45)' },
        },
        bounceY: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
          '50%': { transform: 'translateY(8px)', opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-slow': 'marquee 70s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        kenburns: 'kenburns 22s ease-in-out infinite alternate',
        float: 'float 9s ease-in-out infinite',
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'bounce-y': 'bounceY 1.8s ease-in-out infinite',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Prata', 'serif'],
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(201,162,75,0.35), 0 8px 30px -8px rgba(201,162,75,0.35)',
        'gold-lg': '0 0 0 1px rgba(201,162,75,0.4), 0 20px 60px -12px rgba(201,162,75,0.45)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E0C073 0%, #C9A24B 45%, #8a6a2b 100%)',
        'ink-gradient': 'linear-gradient(180deg, #0d0b09 0%, #161311 100%)',
      },
    },
  },
  plugins: [],
}