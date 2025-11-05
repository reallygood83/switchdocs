/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Black & White Minimal Theme - TEABOARD FORMS inspired
        primary: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#FFFFFF',
          foreground: '#000000',
        },
        accent: {
          DEFAULT: '#1a1a1a',
          foreground: '#FFFFFF',
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#000000',
        },
        foreground: {
          DEFAULT: '#000000',
          muted: '#6b7280',
        },
        border: {
          DEFAULT: '#000000',
          light: '#e5e7eb',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}
