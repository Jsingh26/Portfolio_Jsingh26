/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bgDark: '#0a0a0f',
        bgDarkCard: 'rgba(16, 16, 24, 0.7)',
        bgLight: '#f8fafc',
        bgLightCard: 'rgba(255, 255, 255, 0.8)',
        accentBlue: '#3b82f6',
        accentViolet: '#8b5cf6',
        accentCyan: '#06b6d4',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.35)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.35)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
      }
    },
  },
  plugins: [],
}
