const md = require("../../libraries/material-web-tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: md.theme,
  },
  plugins: [],
};
