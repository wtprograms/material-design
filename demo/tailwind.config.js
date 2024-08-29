const tailwind = require('../tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: tailwind.theme,
  plugins: [],
}

