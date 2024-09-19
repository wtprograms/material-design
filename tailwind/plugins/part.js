const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addUtilities, theme, e }) {
  const parts = theme('parts', {});

  const partUtilities = Object.keys(parts).reduce((acc, part) => {
    const utilities = Object.keys(parts[part]).reduce((innerAcc, key) => {
      innerAcc[`.part-${e(part)}\\:${e(key)}`] = {
        [`&::part(${part})`]: parts[part][key],
      };
      return innerAcc;
    }, {});

    return { ...acc, ...utilities };
  }, {});

  addUtilities(partUtilities, ['responsive', 'hover']);
});