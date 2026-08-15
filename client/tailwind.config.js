/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#03030A',
          space: '#03030A',
          deep: '#070714',
          card: '#0D0E26',
        },
        cosmic: {
          violet: '#8A5CF5',
          indigo: '#6366F1',
          light: '#A78BFA',
        },
        cyan: {
          electric: '#00F2FE',
          sky: '#38BDF8',
          glow: '#7DD3FC',
        },
        supernova: {
          gold: '#FFD700',
          amber: '#F59E0B',
          light: '#FDE047',
        },
        comet: {
          pink: '#FF2A85',
          rose: '#F43F5E',
        },
        pearl: {
          white: '#F8FAFC',
          muted: '#CBD5E1',
          dark: '#64748B',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Outfit', 'Inter', 'sans-serif'],
        sans: ['Inter', 'Satoshi', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 30px -4px rgba(0, 242, 254, 0.45)',
        'glow-gold': '0 0 30px -4px rgba(255, 215, 0, 0.55)',
        'glow-pink': '0 0 30px -4px rgba(255, 42, 133, 0.45)',
        'glow-violet': '0 0 35px -4px rgba(138, 92, 245, 0.5)',
      },
      backgroundImage: {
        'cosmic-radial': 'radial-gradient(ellipse at top, #0D0E26 0%, #03030A 75%)',
        'starlight-gradient': 'linear-gradient(135deg, #FFD700 0%, #00F2FE 50%, #8A5CF5 100%)',
        'button-gradient': 'linear-gradient(135deg, #8A5CF5 0%, #00F2FE 100%)',
      },
    },
  },
  plugins: [],
};
