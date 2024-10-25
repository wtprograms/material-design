const md = require('./projects/wtprograms/material-design/src/tailwind/index.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: md.theme,
  plugins: [md.plugins.typescale],
}