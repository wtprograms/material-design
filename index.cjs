const fs = require("fs");
const path = require("path");

const projectPath = path.join(__dirname, "projects/wtprograms/material-design");
const sourcePage = path.join(projectPath, "src");
const libDir = path.join(sourcePage, "lib");
const outputFilePath = path.join(sourcePage, "public-api.ts");

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith(".ts")) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = getAllFiles(libDir);
const exportStatements = [
  `/// <reference types="@angular/localize" />`,
  ...files.map((file) => {
    const relativePath = `${path.relative(__dirname, file).replace(/\\/g, "/")}`
      .replace("projects/wtprograms/material-design/src", ".")
      .replace(".ts", "");
    return `export * from '${relativePath}';`;
  }),
].join("\n");

fs.writeFileSync(outputFilePath, exportStatements, "utf8");
console.log(`Export statements written to ${outputFilePath}`);
