const themePalette = (name) => [
  name,
  `${name}-on`,
  `${name}-container`,
  `${name}-container-on`,
  `${name}-fixed`,
  `${name}-fixed-on`,
  `${name}-fixed-dim`,
  `${name}-fixed-variant`,
  `${name}-inverse`,
  `${name}-inverse-on`,
];

const colors = [
  'background',
  'background-on',
  ...themePalette('primary'),
  ...themePalette('secondary'),
  ...themePalette('tertiary'),
  ...themePalette('error'),
  'surface',
  'surface-on',
  'surface-variant',
  'surface-variant-on',
  'surface-container-highest',
  'surface-container-high',
  'surface-container',
  'surface-container-low',
  'surface-container-lowest',
  'surface-dim',
  'surface-bright',
  'surface-tint',
  'surface-inverse',
  'surface-inverse-on',
  'outline',
  'outline-variant',
  'scrim',
  'shadow'
];

module.exports = colors.reduce((acc, color) => {
  acc[color] = `var(--md-sys-color-${color})`;
  return acc;
}, {});
