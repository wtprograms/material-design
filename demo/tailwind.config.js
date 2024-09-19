const md = require('../material-design-tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: md.theme,
  plugins: [],
}

