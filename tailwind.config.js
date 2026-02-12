/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
      boxShadow: {
        // Light mode neumorphic shadows
        'neu-light': '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
        'neu-light-pressed': 'inset 6px 6px 10px 0 rgb(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.8)',
        // Dark mode neumorphic shadows (softer matte finish)
        'neu-dark': '4px 4px 8px rgba(0,0,0,0.3), -4px -4px 8px rgba(255,255,255,0.05)',
        'neu-dark-pressed': 'inset 3px 3px 6px rgba(0,0,0,0.4), inset -3px -3px 6px rgba(255,255,255,0.05)',
        // Legacy shadows
        'neumorphic': '8px 8px 16px rgba(0, 0, 0, 0.25), -8px -8px 16px rgba(255, 255, 255, 0.05)',
        'neumorphic-inset': 'inset 6px 6px 12px rgba(0, 0, 0, 0.25), inset -6px -6px 12px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 3s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
