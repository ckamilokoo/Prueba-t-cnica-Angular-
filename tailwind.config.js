/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F5F1E8',
          deep: '#EBE6D9',
          dark: '#14110D',
          'dark-deep': '#0A0907'
        },
        ink: {
          DEFAULT: '#1A1815',
          soft: '#4A453E',
          muted: '#6B655A',
          dark: '#F0EAD8',
          'dark-soft': '#C9C2AE'
        },
        stone: {
          DEFAULT: '#9CA3A6',
          light: '#D4D0C8',
          dark: '#3A352D'
        },
        terracota: {
          DEFAULT: '#C04A1A',
          deep: '#9B3A14',
          soft: '#D86B3F',
          tint: '#F4DDD0'
        },
        success: '#5A7A4A',
        warning: '#B88A2A',
        error: '#A8392E'
      },
      fontFamily: {
        display: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
      },
      borderRadius: {
        none: '0',
        DEFAULT: '2px',
        sm: '2px',
        md: '4px'
      },
      boxShadow: {
        hairline: '0 0 0 0.5px rgba(26, 24, 21, 0.12)',
        'hairline-dark': '0 0 0 0.5px rgba(240, 234, 216, 0.12)',
        soft: '0 1px 2px rgba(26, 24, 21, 0.04), 0 4px 12px rgba(26, 24, 21, 0.04)'
      },
      letterSpacing: {
        tightest: '-0.04em',
        wider: '0.08em',
        widest: '0.18em'
      },
      animation: {
        'fade-in': 'fadeIn 400ms cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-up': 'slideUp 500ms cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-in-right': 'slideInRight 320ms cubic-bezier(0.22, 1, 0.36, 1)'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      }
    }
  },
  plugins: []
};
