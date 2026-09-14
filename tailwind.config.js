/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#627d98',
          500: '#334e68',
          600: '#243b53',
          700: '#1a2c40',
          800: '#102a43',
          900: '#0b2545',
          950: '#071a33',
        },
        accent: {
          50: '#fdf8ed',
          100: '#f9edcf',
          200: '#f0d999',
          300: '#e6c263',
          400: '#d4a853',
          500: '#c2953d',
          600: '#a37a2e',
          700: '#825f27',
          800: '#6b4d24',
          900: '#5a4022',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['"Merriweather"', 'Georgia', 'serif'],
      },
      maxWidth: {
        content: '1280px',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(11,37,69,0.08), 0 4px 16px rgba(11,37,69,0.06)',
        card: '0 2px 6px rgba(11,37,69,0.06), 0 8px 24px rgba(11,37,69,0.08)',
      },
    },
  },
  plugins: [],
};
