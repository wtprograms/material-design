const md = require('../tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: md.theme,
  plugins: [md.plugins.typescale],
}

