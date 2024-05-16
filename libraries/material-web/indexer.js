const fs = require('fs');

const inputDirectories = ['./src/lib/common', './src/lib/components'];

function* getTsFiles(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (file.endsWith('.d.ts')) {
      continue;
    }
    const path = `${directory}/${file}`;
    if (fs.statSync(path).isDirectory()) {
      yield* getTsFiles(path);
    } else if (path.endsWith('.ts')) {
      yield path;
    }
  }
}

function* getModules(inputDirectory, files) {
  for (const file of files) {
    const module = file
      .replace(inputDirectory + '/', '')
      .replace('.ts', '')
      .replace('/index', '');
    if (module === 'index') {
      continue;
    }
    yield `export * from './${module}';`;
  }
}

function run(inputDirectory) {
  const tsFiles = [...getTsFiles(inputDirectory)];
  const modules = [...getModules(inputDirectory, tsFiles)];
  fs.writeFileSync(inputDirectory + '/index.ts', modules.join('\n'));
}

for (const inputDirectory of inputDirectories) {
  run(inputDirectory);
}