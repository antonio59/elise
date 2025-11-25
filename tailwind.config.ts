import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        inkPink: '#ff2da0',
        inkLime: '#a6ff00',
        inkCyan: '#00f0ff',
        inkPurple: '#7a00ff',
        inkYellow: '#ffd400',
        inkBlack: '#0b0b0f'
      }
    }
  },
  plugins: []
}

export default config