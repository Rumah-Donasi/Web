/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/views/**/*.{ejs,html}",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        dark: '#3B9E8C',
        primary: '#5FCFBA',
        secondary: '#A9F1E3',
        dull: '#DDF8F3'
      },
    },
  },
  plugins: [],
}

