# Material Design Web Components

The guidelines that are being followed are as per the [M3 Material website](https://m3.material.io/)

Inspired by [Google's Material Components](https://github.com/material-components/material-web), I created this material-web project to do a couple of things:
* I wanted to learn web components
* I wanted web components to fit in nicer with my projects than Google's material components.

> **NOTE!**
I **strongly** recommend to rather user [Google's Material Components](https://github.com/material-components/material-web). Currently, I am using some of their components and changed it a bit to match my needs. This is subject to change and I might even do away with them.

## Build

I am using webpack to build the project. Just run `npm run build`, and you'll have the files in dist.

## Components

### Official

The following components are as per M3:

- App bars
  - [ ] Top
  - [ ] Bottom
- [X] Badges
- Buttons
  - [X] Common buttons
  - [X] FAB
  - [X] Extended FAB
  - [X] Icon buttons
  - [ ] Segmented buttons
- [ ] Cards
- [ ] Carousel
- [ ] Checkbox :: *In development*
- [ ] Chips
- [ ] Date pickers
- [ ] Dialogs
- [ ] Lists
- [ ] Menus
- Navigation
  - [X] Bar
  - [ ] Drawer
  - [X] Rail
- [ ] Progress indicators
- [ ] Radio button :: *In development*
- [ ] Search
- Sheets
  - [ ] Bottom
  - [ ] Side
- [ ] Sliders
- [ ] Snackbar
- [ ] Switch :: *In development*
- [ ] Tabs
- [ ] Text fields
- [ ] Time pickers
- [ ] Tooltips

### Unofficial

- [X] Elevation
- [X] Focus ring
- [X] Icon
- [X] Navigation item
- [X] Navigation drawer item
- [X] Ripple

## Styles

* **imports** - for all various @import's
* **methods** - mixins and functions
* **reboot** - to reboot the html
* **tokens** - all tokens as per M3
* **variables** - various scss variables.

### Use
To make use of it, you can either just import the css file, or you can use the styles.scss and put the following in your scss.

```scss
@use 'node_modules/@wtprograms/material-web' as md;

@include md.initialize;
```

### Palette
I have chosen to make the palette dynamic coloring based on a base hue. So, if you want to change the hue, you can simple do the following:
```css
:root {
  --md-ref-palette-hue-base: 100;
}
```

### Tailwind
I am planning to make use of Tailwind in the future, by having my own plugins and classes. So, the styles of the components will be based on the components tokens. For example:

```html
<div class="text-primary bg-tertiary">
</div>
```

And I will also have Tailwind classes for the components:

```html
<md-button variant="filled" class="button-container-color-tertiary button-label-color-tertiary-on">
</md-button>
```

This will produce:
```css
:host {
  --md-comp-button-container-color: var(--md-sys-color-tertiary);
  --md-comp-button-label-color: var(--md-sys-color-tertiary-on);
}
```

Unfortunately, I do not have a way to limit Tailwind classes to the tag, so you will be bombarded with the the classes. But you can choose to turn it on or off in the `tailwind.config.js`.