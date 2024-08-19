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
    path: 'date-picker',
    loadComponent: () => import('./date-picker'),
  },
  {
    path: 'date-picker-calendar',
    loadComponent: () => import('./date-picker-calendar'),
  },
  {
    path: 'date-picker-selector',
    loadComponent: () => import('./date-picker-selector'),
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
    path: 'dropdown',
    loadComponent: () => import('./dropdown'),
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
    path: 'text-field',
    loadComponent: () => import('./text-field'),
  },
  {
    path: 'time-picker',
    loadComponent: () => import('./time-picker'),
  },
  {
    path: 'tooltip',
    loadComponent: () => import('./tooltip'),
  },
  {
    path: 'typescale',
    loadComponent: () => import('./typescale'),
  },
] satisfies Routes;
