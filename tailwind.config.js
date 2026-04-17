/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cairn: {
          stone: '#5A5A5A',
          dark: '#1A1A1A',
          light: '#F5F5F5',
        },
      },
    },
  },
  plugins: [],
}
