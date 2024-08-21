const fs = require('fs-extra');
fs.copy('./src/styles', './dist/styles');
fs.copy('./package.json', './dist/package.json');
fs.copy('./README.md', './dist/README.md');
