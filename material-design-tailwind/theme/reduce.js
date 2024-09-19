module.exports = (key, array) => array.reduce((acc, colorName) => {
  acc[colorName] = `var(--md-sys-${key}-${colorName})`;
  return acc;
}, {});