# material-design
`@wtprograms/material-design` is a library of web components and styles for [Material 3](https://m3.material.io/components).

## Installation
To install this package, first install it via NPM:
```
npm install @wtprograms/material-design
```

Then add it to your project:
```html
<html>
  <head>
    ...
    <link rel="stylesheet" href="./node_modules/@wtprograms/material-design/styles.css">
  </head>
  <body>
    ...
    <script src="./node_modules/@wtprograms/material-design/index.js"></script>
  </body>
</html>
``` 

### SCSS
Should you want to import the scss files. You can just add the following to your entry .scss file:
```scss
@use 'node_modules/@wtprograms/material-design/styles/index' as md;

@include md.initialize;
```

## Demo

To run the demo after cloning the project, you need to run these two commands in separate terminals.

For the library, in the library folder, run:
```
npm run watch
```

And for the demo, in the demo folder, run:
```
npm start
```

## Components
- [X] Avatar
- [X] Badge
- [X] Button
- [X] Card
- [X] Check Box
- [X] Chip
- [X] Date Picker
- [X] Dialog
- [X] Dropdown
- [X] Fab
- [X] Icon
- [X] Icon Button
- [X] List
- [X] Menu
- [X] Navigation
- [X] Progress Indicator
- [X] Radio Button
- [X] Segmented Buttons
- [X] Sheet
- [X] Snack Bar
- [X] Switch
- [X] Tabs
- [X] Text field
- [X] Time Picker
- [X] Tooltip
