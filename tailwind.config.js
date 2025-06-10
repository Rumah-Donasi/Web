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
      keyframes: {
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' }
            },
            slideUp: {
              '0%': { transform: 'translateY(20px)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' }
            },
            float: {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' }
            }
          }
    },
  },
  plugins: [],
}

