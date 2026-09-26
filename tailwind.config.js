/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: '#151B2C',
        'surface-elevated': '#1E2740',
        primary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          DEFAULT: '#7C3AED',
        },
        accent: {
          blue: '#3B82F6',
          green: '#10B981',
          red: '#EF4444',
          amber: '#F59E0B',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        h3: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        body: ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in',
        slideUp: 'slideUp 0.3s ease-out',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.5)' },
          '50%': { boxShadow: '0 0 0 8px rgba(16, 185, 129, 0)' },
        },
      },
    },
  },
  plugins: [],
}
