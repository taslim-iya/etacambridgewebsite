/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        eta: {
          cream: '#f7f2e4',
          'cream-dark': '#ede8d8',
          navy: '#1A1819',
          'navy-mid': '#333132',
          'navy-light': '#4a4849',
          gold: '#FFB81C',
          'gold-light': '#FFC94D',
          'gold-dark': '#E5A200',
          teal: '#066163',
          'teal-light': '#0A8385',
          border: '#d8d0be',
          'border-dark': '#b8ad98',
          muted: '#6b6453',
          'muted-light': '#9a907e',
          white: '#ffffff',
        },
      },
      fontFamily: {
        display: ['"Arial Black"', 'Impact', 'sans-serif'],
        sans: ['Arial', 'Helvetica Neue', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
};
