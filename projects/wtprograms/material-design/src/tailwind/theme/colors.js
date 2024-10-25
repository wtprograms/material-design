const reduce = require('./reduce');

const paleteColors = (name) => [
  name,
  `${name}-on`,
  `${name}-container`,
  `${name}-container-on`,
  `${name}-fixed`,
  `${name}-fixed-on`,
  `${name}-fixed-dim`,
  `${name}-fixed-dim-on`,
  `${name}-fixed-variant`,
  `${name}-fixed-variant-on`,
  `${name}-inverse`,
  `${name}-inverse-on`,
];

module.exports = reduce('color', [
  'background',
  'background-on',
  ...paleteColors('primary'),
  ...paleteColors('secondary'),
  ...paleteColors('tertiary'),
  ...paleteColors('error'),
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
  'scrim',
  'outline',
  'outline-variant',
  'transparent',
  'white',
  'black'
]);