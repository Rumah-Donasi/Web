/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{ejs,html}",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7AE2CF',
        secondary: '#B3EEE4',
        dull: '#D9FFF9'
      },
      screens: {
        'sm': '576px',
        'md': '960px',
        'lg': '1440px',
      },
    },
  },
  plugins: [],
}

