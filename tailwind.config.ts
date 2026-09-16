import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dais-red': '#c03333', // Rojo del botón
        'dais-cream': '#fce4c8', // Color crema del título
        'dais-dark': '#111111',
        'dais-gray': '#E6E6E6',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'], // Para el logo
      },
      keyframes: {
        jumpIn: {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        tada: {
          '0%': { transform: 'scale3d(1, 1, 1)' },
          '10%, 20%': { transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)' },
          '30%, 50%, 70%, 90%': { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' },
          '40%, 60%, 80%': { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' },
          '100%': { transform: 'scale3d(1, 1, 1)' },
        },
        bounceDouble: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-25px)' },
          '50%': { transform: 'translateY(0)' },
          '75%': { transform: 'translateY(-12px)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        zoomInOut: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        zoomInSlow: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        }
      },
      animation: {
        'zoom-in-out': 'zoomInOut 8s ease-in-out infinite',
        'jump-in': 'jumpIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'tada': 'tada 1s ease-in-out forwards',
        'bounce-double': 'bounceDouble 1s ease-in-out forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'zoom-in-slow': 'zoomInSlow 6s linear forwards',
      }
    },
  },
  plugins: [],
}
export default config
