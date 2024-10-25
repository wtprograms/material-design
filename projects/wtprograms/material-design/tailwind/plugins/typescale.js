module.exports = function({ addUtilities }) {
  const scales = ['display', 'headline', 'body', 'title', 'label'];
  const sizes = ['large', 'medium', 'small'];
  const utilities = {};
  for (const scale of scales) {
    for (const size of sizes) {
      utilities[`.typescale-${scale}-${size}`] = {
        fontFamily: `var(--md-sys-typescale-${scale}-${size}-font)`,
        fontWeight: `var(--md-sys-typescale-${scale}-${size}-weight)`,
        fontSize: `var(--md-sys-typescale-${scale}-${size}-size)`,
      };
    }
  }

  addUtilities(utilities, ['responsive', 'hover']);
};