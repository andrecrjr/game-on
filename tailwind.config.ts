import type { Config } from 'tailwindcss';

const config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: '#2d3748',
        input: '#4a5568',
        ring: '#805ad5',
        background: '#1a202c',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#805ad5',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#d53f8c',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#e53e3e',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#718096',
          foreground: '#e2e8f0',
        },
        accent: {
          DEFAULT: '#38a169',
          foreground: '#ffffff',
        },
        popover: {
          DEFAULT: '#2d3748',
          foreground: '#ffffff',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      gridTemplateColumns: {
        recentPlayed: '32px 1fr',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
