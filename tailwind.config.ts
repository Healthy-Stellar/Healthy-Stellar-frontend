import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#00C896',
          50:  '#E6FFF8',
          100: '#B3FFE9',
          200: '#66FFD2',
          300: '#1AFFBA',
          400: '#00E6A6',
          500: '#00C896',
          600: '#00A07A',
          700: '#007858',
          800: '#005038',
          900: '#002818',
        },
        surface: {
          base:   '#0B0E0D',
          raised: '#111614',
          card:   '#161B19',
          inset:  '#1A201E',
          hover:  '#1F2724',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          focus:   'rgba(0,200,150,0.35)',
          strong:  'rgba(255,255,255,0.12)',
        },
        text: {
          1: '#F0F5F3',
          2: '#8E9E99',
          3: '#4E5E5A',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'glow-sm':  '0 0 12px rgba(0,200,150,0.2)',
        'glow-md':  '0 0 24px rgba(0,200,150,0.25)',
        'glow-lg':  '0 0 48px rgba(0,200,150,0.2)',
        'card':     '0 2px 12px rgba(0,0,0,0.3)',
        'card-lg':  '0 8px 40px rgba(0,0,0,0.4)',
        'inset':    'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      backgroundImage: {
        'green-gradient': 'linear-gradient(135deg, #00C896 0%, #00E6A6 100%)',
        'card-gradient':  'linear-gradient(145deg, rgba(0,200,150,0.05) 0%, transparent 60%)',
      },
      animation: {
        'pulse-dot':  'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':      'fadeIn 0.3s ease',
        'slide-up':     'slideUp 0.3s ease',
        'slide-right':  'slideRight 0.25s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideRight: { from: { opacity: '0', transform: 'translateX(-16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};

export default config;
