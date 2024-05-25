import { Routes } from '@angular/router';

export default [
  {
    path: 'avatar',
    loadComponent: () => import('./avatar/avatar.component'),
  },
  {
    path: 'badge',
    loadComponent: () => import('./badge/badge.component'),
  },
  {
    path: 'button',
    loadComponent: () => import('./button/button.component'),
  },
  {
    path: 'card',
    loadComponent: () => import('./card/card.component'),
  },
  {
    path: 'checkbox',
    loadComponent: () => import('./checkbox/checkbox.component'),
  },
  {
    path: 'colors',
    loadComponent: () => import('./colors/colors.component'),
  },
  {
    path: 'dialog',
    loadComponent: () => import('./dialog/dialog.component'),
  },
  {
    path: 'divider',
    loadComponent: () => import('./divider/divider.component'),
  },
  {
    path: 'elevation',
    loadComponent: () => import('./elevation/elevation.component'),
  },
  {
    path: 'fab',
    loadComponent: () => import('./fab/fab.component'),
  },
  {
    path: 'focus-ring',
    loadComponent: () => import('./focus-ring/focus-ring.component'),
  },
  {
    path: 'icon',
    loadComponent: () => import('./icon/icon.component'),
  },
  {
    path: 'icon-button',
    loadComponent: () => import('./icon-button/icon-button.component'),
  },
  {
    path: 'list',
    loadComponent: () => import('./list/list.component'),
  },
  {
    path: 'list-item',
    loadComponent: () => import('./list-item/list-item.component'),
  },
  {
    path: 'menu',
    loadComponent: () => import('./menu/menu.component'),
  },
  {
    path: 'menu-item',
    loadComponent: () => import('./menu-item/menu-item.component'),
  },
  {
    path: 'navigation',
    loadComponent: () => import('./navigation/navigation.component'),
  },
  {
    path: 'navigation-item',
    loadComponent: () => import('./navigation-item/navigation-item.component'),
  },
  {
    path: 'navigation-headline',
    loadComponent: () => import('./navigation-headline/navigation-headline.component'),
  },
  {
    path: 'radiobutton',
    loadComponent: () => import('./radiobutton/radiobutton.component'),
  },
  {
    path: 'ripple',
    loadComponent: () => import('./ripple/ripple.component'),
  },
  {
    path: 'typescale',
    loadComponent: () => import('./typescale/typescale.component'),
  },
  {
    path: 'segmented-button',
    loadComponent: () => import('./segmented-button/segmented-button.component'),
  },
  {
    path: 'segmented-button-set',
    loadComponent: () => import('./segmented-button-set/segmented-button-set.component'),
  },
  {
    path: 'sheet',
    loadComponent: () => import('./sheet/sheet.component'),
  },
  {
    path: 'snackbar',
    loadComponent: () => import('./snackbar/snackbar.component'),
  },
  {
    path: 'switch',
    loadComponent: () => import('./switch/switch.component'),
  },
  {
    path: 'tooltip',
    loadComponent: () => import('./tooltip/tooltip.component'),
  },
  {
    path: 'typescale',
    loadComponent: () => import('./typescale/typescale.component'),
  },
] satisfies Routes;
