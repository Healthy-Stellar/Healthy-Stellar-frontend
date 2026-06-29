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
        primary: 'var(--primary)',
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
          base:   'var(--bg-base)',
          raised: 'var(--bg-raised)',
          card:   'var(--bg-card)',
          inset:  'var(--bg-inset)',
          hover:  'var(--bg-hover)',
        },
        border: {
          DEFAULT: 'var(--border)',
          focus:   'var(--border-focus)',
          strong:  'rgba(255,255,255,0.12)',
        },
        text: {
          1: 'var(--text-1)',
          2: 'var(--text-2)',
          3: 'var(--text-3)',
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
        'fade-in':    'fadeIn 0.3s ease',
        'slide-up':   'slideUp 0.3s ease',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};

export default config;
