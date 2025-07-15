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
        // Enhanced gaming color palette with better contrast
        border: '#374151',
        input: '#4b5563',
        ring: '#8b5cf6',
        background: '#0f172a',
        foreground: '#f8fafc',

        // Primary gaming colors with improved contrast
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
          DEFAULT: '#8b5cf6',
          foreground: '#ffffff',
        },

        // Secondary gaming colors (cyan/teal)
        secondary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
          DEFAULT: '#06b6d4',
          foreground: '#ffffff',
        },

        // Enhanced destructive colors
        destructive: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },

        // Improved muted colors for better readability
        muted: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
          DEFAULT: '#64748b',
          foreground: '#f1f5f9',
        },

        // Gaming accent colors
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
          DEFAULT: '#22c55e',
          foreground: '#ffffff',
        },

        // Enhanced popover colors
        popover: {
          DEFAULT: '#1e293b',
          foreground: '#f8fafc',
        },

        // Gaming card colors
        card: {
          DEFAULT: '#1e293b',
          foreground: '#f8fafc',
        },

        // Gaming-specific colors
        gaming: {
          purple: {
            light: '#a855f7',
            DEFAULT: '#8b5cf6',
            dark: '#7c3aed',
            glow: '#c084fc',
          },
          cyan: {
            light: '#22d3ee',
            DEFAULT: '#06b6d4',
            dark: '#0891b2',
            glow: '#67e8f9',
          },
          background: {
            primary: '#0f172a',
            secondary: '#1e293b',
            tertiary: '#334155',
          },
          text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
            tertiary: '#94a3b8',
            accent: '#a855f7',
          },
        },
      },

      // Enhanced border radius for gaming aesthetic
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        gaming: '12px',
        'gaming-lg': '16px',
        'gaming-xl': '20px',
      },

      // Enhanced keyframes for gaming animations
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-navigation-menu-viewport-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-navigation-menu-viewport-height)' },
          to: { height: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
            textShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)',
            textShadow: '0 0 20px rgba(139, 92, 246, 0.8)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '0.4',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.05)',
          },
        },
        'slide-in': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },

      // Enhanced animations
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        glow: 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out forwards',
      },

      // Gaming-specific spacing
      spacing: {
        gaming: '0.75rem',
        'gaming-lg': '1.5rem',
        'gaming-xl': '2.5rem',
      },

      // Enhanced grid templates
      gridTemplateColumns: {
        recentPlayed: '32px 1fr',
        gaming: 'repeat(auto-fit, minmax(280px, 1fr))',
        'gaming-sm': 'repeat(auto-fit, minmax(200px, 1fr))',
      },

      // Gaming-specific shadows
      boxShadow: {
        gaming: '0 4px 20px rgba(139, 92, 246, 0.15)',
        'gaming-lg': '0 8px 32px rgba(139, 92, 246, 0.25)',
        'gaming-xl': '0 16px 64px rgba(139, 92, 246, 0.35)',
        'gaming-glow': '0 0 20px rgba(139, 92, 246, 0.4)',
      },

      // Enhanced typography
      fontSize: {
        'gaming-xs': ['0.75rem', { lineHeight: '1rem' }],
        'gaming-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'gaming-base': ['1rem', { lineHeight: '1.5rem' }],
        'gaming-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'gaming-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'gaming-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'gaming-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'gaming-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        'gaming-5xl': ['3rem', { lineHeight: '1' }],
        'gaming-6xl': ['3.75rem', { lineHeight: '1' }],
        'gaming-7xl': ['4.5rem', { lineHeight: '1' }],
        'gaming-8xl': ['6rem', { lineHeight: '1' }],
        'gaming-9xl': ['8rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
