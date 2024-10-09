/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Aqui ele procurará em todos os arquivos JSX, TSX, etc.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
