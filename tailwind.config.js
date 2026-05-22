/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#EEF5F0',
          100: '#D5E8DB',
          200: '#AECFB9',
          300: '#87B698',
          400: '#5F9B75',
          500: '#7FB08F',
          600: '#5A9470',
          700: '#3D7250',
          800: '#265035',
          900: '#12301E',
        },
        warm: {
          50:  '#FAFAF8',
          100: '#F5F3EF',
          200: '#EBE7DF',
          300: '#D8D2C6',
          400: '#B8B2A6',
          500: '#948E82',
          600: '#6B6860',
          700: '#4A4840',
          800: '#2C2A24',
          900: '#1A1916',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft':   '0 2px 16px rgba(0,0,0,0.06)',
        'medium': '0 4px 24px rgba(0,0,0,0.09)',
        'large':  '0 8px 40px rgba(0,0,0,0.12)',
        'inner-soft': 'inset 0 1px 3px rgba(0,0,0,0.05)',
      },
      animation: {
        'slide-up':   'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
        'slide-down': 'slideDown 0.35s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':    'fadeIn 0.25s ease-out',
        'scale-in':   'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)',
        'bounce-in':  'bounceIn 0.4s cubic-bezier(0.16,1,0.3,1)',
        'check':      'check 0.3s cubic-bezier(0.16,1,0.3,1)',
        'spin-slow':  'spin 3s linear infinite',
      },
      keyframes: {
        slideUp:   { from: { transform: 'translateY(24px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        slideDown: { from: { transform: 'translateY(-16px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        scaleIn:   { from: { transform: 'scale(0.93)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } },
        bounceIn:  { '0%': { transform: 'scale(0.8)', opacity: 0 }, '60%': { transform: 'scale(1.06)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
        check:     { '0%': { transform: 'scale(0.6)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
      },
    },
  },
  plugins: [],
};
