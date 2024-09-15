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
    path: 'calendar-picker',
    loadComponent: () => import('./calendar-picker'),
  },
  {
    path: 'calendar-month-year-picker',
    loadComponent: () => import('./calendar-month-year-picker'),
  },
  {
    path: 'calendar-month-year-list-picker',
    loadComponent: () => import('./calendar-month-year-list-picker'),
  },
  {
    path: 'check-box',
    loadComponent: () => import('./check-box'),
  },
  {
    path: 'date-picker',
    loadComponent: () => import('./date-picker'),
  },
  {
    path: 'date-picker-field',
    loadComponent: () => import('./date-picker-field'),
  },
  {
    path: 'dropdown-field',
    loadComponent: () => import('./dropdown-field'),
  },
  {
    path: 'elevation',
    loadComponent: () => import('./elevation'),
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
    path: 'list-item',
    loadComponent: () => import('./list-item'),
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
    path: 'popover',
    loadComponent: () => import('./popover'),
  },
  {
    path: 'progress-indicator',
    loadComponent: () => import('./progress-indicator'),
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
    path: 'radio-button',
    loadComponent: () => import('./radio-button'),
  },
  {
    path: 'ripple',
    loadComponent: () => import('./ripple'),
  },
  {
    path: 'switch',
    loadComponent: () => import('./switch'),
  },
  {
    path: 'text-field',
    loadComponent: () => import('./text-field'),
  },
] satisfies Routes;
