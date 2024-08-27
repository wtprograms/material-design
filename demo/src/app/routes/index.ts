import { Routes } from '@angular/router';

export default [
  {
    path: 'avatar',
    loadComponent: () => import('./avatar'),
  },
  {
    path: 'badge',
    loadComponent: () => import('./badge'),
  },
  {
    path: 'button',
    loadComponent: () => import('./button'),
  },
  {
    path: 'check-box',
    loadComponent: () => import('./check-box'),
  },
  {
    path: 'card',
    loadComponent: () => import('./card'),
  },
  {
    path: 'chip',
    loadComponent: () => import('./chip'),
  },
  {
    path: 'colors',
    loadComponent: () => import('./colors'),
  },
  {
    path: 'divider',
    loadComponent: () => import('./divider'),
  },
  {
    path: 'dialog',
    loadComponent: () => import('./dialog'),
  },
  {
    path: 'elevation',
    loadComponent: () => import('./elevation'),
  },
  {
    path: 'fab',
    loadComponent: () => import('./fab'),
  },
  {
    path: 'focus-ring',
    loadComponent: () => import('./focus-ring'),
  },
  {
    path: 'field',
    loadComponent: () => import('./field'),
  },
  {
    path: 'icon',
    loadComponent: () => import('./icon'),
  },
  {
    path: 'icon-button',
    loadComponent: () => import('./icon-button'),
  },
  {
    path: 'list',
    loadComponent: () => import('./list'),
  },
  {
    path: 'list-item',
    loadComponent: () => import('./list-item'),
  },
  {
    path: 'navigation',
    loadComponent: () => import('./navigation'),
  },
  {
    path: 'menu',
    loadComponent: () => import('./menu'),
  },
  {
    path: 'menu-item',
    loadComponent: () => import('./menu-item'),
  },
  {
    path: 'navigation-item',
    loadComponent: () => import('./navigation-item'),
  },
  {
    path: 'navigation-headline',
    loadComponent: () => import('./navigation-headline'),
  },
  {
    path: 'progress-indicator',
    loadComponent: () => import('./progress-indicator'),
  },
  {
    path: 'ripple',
    loadComponent: () => import('./ripple'),
  },
  {
    path: 'radio-button',
    loadComponent: () => import('./radio-button'),
  },
  {
    path: 'segmented-button',
    loadComponent: () => import('./segmented-button'),
  },
  {
    path: 'segmented-button-set',
    loadComponent: () => import('./segmented-button-set'),
  },
  {
    path: 'switch',
    loadComponent: () => import('./switch'),
  },
  {
    path: 'snack-bar',
    loadComponent: () => import('./snack-bar'),
  },
  {
    path: 'sheet',
    loadComponent: () => import('./sheet'),
  },
  {
    path: 'tab',
    loadComponent: () => import('./tab'),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs'),
  },
  {
    path: 'tooltip',
    loadComponent: () => import('./tooltip'),
  },
  {
    path: 'text-field',
    loadComponent: () => import('./text-field'),
  },
  {
    path: 'search',
    loadComponent: () => import('./search'),
  },
  {
    path: 'top-app-bar',
    loadComponent: () => import('./top-app-bar'),
  },
  {
    path: 'typescale',
    loadComponent: () => import('./typescale'),
  },
] satisfies Routes;
