const reduce = require('./reduce');

const docks = (name) => [
  name,
  `${name}-top`,
  `${name}-end`,
  `${name}-bottom`,
  `${name}-start`,
];

module.exports = reduce('shape', [
  ...docks('extra-small'),
  ...docks('small'),
  ...docks('medium'),
  ...docks('large'),
  ...docks('extra-large'),
  ...docks('full'),
]);