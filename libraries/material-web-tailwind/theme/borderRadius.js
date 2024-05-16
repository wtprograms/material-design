const shapes = ['extra-small', 'small', 'medium', 'large', 'extra-large', 'full'];

const sides = ['top', 'end', 'bottom', 'start'];

const shapeAndSides = [];
for (const shape of shapes) {
  shapeAndSides.push(shape);
  for (const side of sides) {
    shapeAndSides.push(`${shape}-${side}`);
  }
}

module.exports = shapeAndSides.reduce((acc, shape) => {
  acc[shape] = `var(--md-sys-shape-${shape})`;
  return acc;
}, {});
