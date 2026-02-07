/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        vt323: ['VT323', 'monospace'],
        'press-start': ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        phosphor: '#33ff33',
        amber: '#ffb000',
        critical: '#cc0000',
        terminal: '#0a0e0a',
      },
      animation: {
        flicker: 'flicker 0.15s infinite',
        shake: 'shake 0.5s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
      },
    },
  },
  plugins: [],
}
