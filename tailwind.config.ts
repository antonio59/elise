import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Manga-inspired color palette 🌸
        sakura: {
          50: '#fff5f7',
          100: '#ffe4ec',
          200: '#ffccd9',
          300: '#ffb3c6',
          400: '#ff8fab',
          500: '#ff6b95',
          600: '#ff4778',
          700: '#e6325f',
          800: '#c22a4f',
          900: '#9e2642',
        },
        // Deep ink for text and accents
        ink: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0d1117',
        },
        // Anime gold for stars and achievements
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Kawaii purple
        kawaii: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Sky blue for accents
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Mint for success states
        mint: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Legacy ink colors (keeping for compatibility)
        inkPink: '#ff6b95',
        inkLime: '#a6ff00',
        inkCyan: '#00f0ff',
        inkPurple: '#9333ea',
        inkYellow: '#fbbf24',
        inkBlack: '#0d1117',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        manga: ['var(--font-manga)', 'Comic Sans MS', 'cursive'],
      },
      backgroundImage: {
        // Manga-style gradients
        'gradient-sakura': 'linear-gradient(135deg, #ff6b95 0%, #ffb3c6 50%, #fff5f7 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #ff6b95 0%, #fbbf24 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)',
        'gradient-magic': 'linear-gradient(135deg, #9333ea 0%, #ff6b95 100%)',
        'gradient-mint': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        // Speed lines pattern (manga effect)
        'speed-lines': 'repeating-linear-gradient(90deg, transparent 0px, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)',
        // Dot pattern (manga screentone)
        'dots': 'radial-gradient(circle, #00000008 1px, transparent 1px)',
      },
      backgroundSize: {
        'dots-sm': '8px 8px',
        'dots-md': '16px 16px',
        'dots-lg': '24px 24px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'petal-fall': 'petal-fall 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'petal-fall': {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
      boxShadow: {
        'manga': '4px 4px 0px 0px rgba(0,0,0,0.1)',
        'manga-lg': '8px 8px 0px 0px rgba(0,0,0,0.1)',
        'manga-sakura': '4px 4px 0px 0px rgba(255,107,149,0.3)',
        'glow-sakura': '0 0 20px rgba(255,107,149,0.3)',
        'glow-kawaii': '0 0 20px rgba(168,85,247,0.3)',
      },
      borderRadius: {
        'manga': '1.5rem',
        'blob': '60% 40% 30% 70% / 60% 30% 70% 40%',
      },
    }
  },
  plugins: []
}

export default config
