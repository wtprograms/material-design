const fs = require('fs');

const inputDirectory = process.argv[2];

function convert(cssFilePath) {
  if (!cssFilePath) {
    throw new Error(`Usage: node scripts/css-to-ts.js <input.css> [output.ts]`);
  }
  
  const tsFilePath = cssFilePath.replace('.css', '.ts');
  const cssContent = fs
    .readFileSync(cssFilePath, {encoding: 'utf8'})
    // Remove source map comments since the css is embedded.
    // "/*# sourceMappingURL=checkbox-styles.css.map */"
    .replace(/\/\*#\ sourceMappingURL=[^\*]+ \*\//, '');
  
  fs.writeFileSync(
    tsFilePath,
    `// Generated stylesheet for ${cssFilePath}.
  import {css} from 'lit';
  export const styles = css\`${cssContent}\`;
  `,
  );
}

function convertDirectory(directory) {
  const items = fs.readdirSync(directory);
  for (const item of items) {
    const stat = fs.statSync(`${directory}/${item}`);
    if (stat.isDirectory()) {
      convertDirectory(`${directory}/${item}`);
    }
    if (item.endsWith('.css')) {
      convert(`${directory}/${item}`);
    }
  }
}

convertDirectory(inputDirectory);
console.log('css-to-ts conversion completed');

if (process.argv[3] === '-w') {
  fs.watch(inputDirectory, {recursive: true}, (event, filename) => {
    if (filename.endsWith('.css')) {
      convert(`${inputDirectory}/${filename}`);
      console.log(`Updated ${filename}`);
    }
  });
}

