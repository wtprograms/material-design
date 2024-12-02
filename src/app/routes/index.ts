import { Routes } from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'introduction',
    pathMatch: 'full',
  },
  {
    path: 'introduction',
    title: $localize`Introduction`,
    loadComponent: () => import('./introduction')
  },
  {
    path: 'quick-start',
    title: $localize`Quick start`,
    loadComponent: () => import('./quick-start')
  },
  {
    path: 'accordion',
    title: $localize`Accordion`,
    loadComponent: () => import('./accordion')
  },
  {
    path: 'app-bar',
    title: $localize`App Bar`,
    loadComponent: () => import('./app-bar')
  },
  {
    path: 'avatar',
    title: $localize`Avatar`,
    loadComponent: () => import('./avatar')
  },
  {
    path: 'button',
    title: $localize`Button`,
    loadComponent: () => import('./button')
  },
  {
    path: 'dialog',
    loadComponent: () => import('./dialog')
  }
] satisfies Routes;
