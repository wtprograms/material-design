import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./layout'),
    children: [
      {
        path: 'accordion',
        loadComponent: () => import('./accordion'),
      },
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
        path: 'card',
        loadComponent: () => import('./card'),
      },
      {
        path: 'check',
        loadComponent: () => import('./check'),
      },
      {
        path: 'chip',
        loadComponent: () => import('./chip'),
      },
      {
        path: 'chips-field',
        loadComponent: () => import('./chips-field'),
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
        path: 'dialog',
        loadComponent: () => import('./dialog'),
      },
      {
        path: 'drop-down-field',
        loadComponent: () => import('./drop-down-field'),
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
        path: 'field',
        loadComponent: () => import('./field'),
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
        path: 'menu',
        loadComponent: () => import('./menu'),
      },
      {
        path: 'navigation',
        loadComponent: () => import('./navigation'),
      },
      {
        path: 'popover',
        loadComponent: () => import('./popover'),
      },
      {
        path: 'ripple',
        loadComponent: () => import('./ripple'),
      },
      {
        path: 'segmented-button',
        loadComponent: () => import('./segmented-button'),
      },
      {
        path: 'search',
        loadComponent: () => import('./search'),
      },
      {
        path: 'sheet',
        loadComponent: () => import('./sheet'),
      },
      {
        path: 'slider',
        loadComponent: () => import('./slider'),
      },
      {
        path: 'snack-bar',
        loadComponent: () => import('./snack-bar'),
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
        path: 'tint',
        loadComponent: () => import('./tint'),
      },
      {
        path: 'tooltip',
        loadComponent: () => import('./tooltip'),
      },
    ],
  },
] satisfies Routes;
