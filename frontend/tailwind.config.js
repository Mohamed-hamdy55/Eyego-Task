/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  mode: "jit",
  theme: {
    extend: {
      screens:{
        "2560px":"2560px",
        "1440px":"1440px",
        "1024px":"1024px",
        "768px":"768px",
        "425px":"425px",
        "375px":"375px",
        "320px":"320px"
      }
    },
  },
  plugins: [],
}

