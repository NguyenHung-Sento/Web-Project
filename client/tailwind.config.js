/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./public/index.html"
  ],
  theme: {
    fontFamily: {
      main: ['Poppins', 'sans-serif']
    },
    extend: {
      width: {
        main: '1220px',
      },
      backgroundColor: {
        main: '#156082'
      },
      colors: {
        main: '#156082'
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp")
  ],
}