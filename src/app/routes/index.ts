import { Routes } from '@angular/router';

export default [
  {
    path: 'accordian',
    title: 'Accordian',
    loadComponent: () => import('./accordian/accordian.page'),
  },
  {
    path: 'avatar',
    title: 'Avatar',
    loadComponent: () => import('./avatar/avatar.page'),
  },
  {
    path: 'badge',
    title: 'Badge',
    loadComponent: () => import('./badge/badge.page'),
  },
  {
    path: 'breadcrumb',
    title: 'Breadcrumb',
    loadComponent: () => import('./breadcrumb/breadcrumb.page'),
  },
  {
    path: 'button',
    title: 'Button',
    loadComponent: () => import('./button/button.page'),
  },
  {
    path: 'card',
    title: 'Card',
    loadComponent: () => import('./card/card.page'),
  },
  {
    path: 'check',
    title: 'Check',
    loadComponent: () => import('./check/check.page'),
  },
  {
    path: 'chip',
    title: 'Chip',
    loadComponent: () => import('./chip/chip.page'),
  },
  {
    path: 'colors',
    title: 'Colors',
    loadComponent: () => import('./colors/colors.page'),
  },
  {
    path: 'date-picker',
    title: 'Date Picker',
    loadComponent: () => import('./date-picker/date-picker.page'),
  },
  {
    path: 'dialog',
    title: 'Dialog',
    loadComponent: () => import('./dialog/dialog.page'),
  },
  {
    path: 'divider',
    title: 'Divider',
    loadComponent: () => import('./divider/divider.page'),
  },
  {
    path: 'dropdown',
    title: 'Dropdown',
    loadComponent: () => import('./dropdown/dropdown.page'),
  },
  {
    path: 'elevation',
    title: 'Elevation',
    loadComponent: () => import('./elevation/elevation.page'),
  },
  {
    path: 'fab',
    title: 'Fab',
    loadComponent: () => import('./fab/fab.page'),
  },
  {
    path: 'field',
    title: 'Field',
    loadComponent: () => import('./field/field.page'),
  },
  {
    path: 'focus-ring',
    title: 'Focus Ring',
    loadComponent: () => import('./focus-ring/focus-ring.page'),
  },
  {
    path: 'icon',
    title: 'Icon',
    loadComponent: () => import('./icon/icon.page'),
  },
  {
    path: 'icon-button',
    title: 'Icon Button',
    loadComponent: () => import('./icon-button/icon-button.page'),
  },
  {
    path: 'list',
    title: 'List',
    loadComponent: () => import('./list/list.page'),
  },
  {
    path: 'menu',
    title: 'Menu',
    loadComponent: () => import('./menu/menu.page'),
  },
  {
    path: 'navigation',
    title: 'Navigation',
    loadComponent: () => import('./navigation/navigation.page'),
  },
  {
    path: 'popover',
    title: 'Popover',
    loadComponent: () => import('./popover/popover.page'),
  },
  {
    path: 'progress-indicator',
    title: 'Progress Indicator',
    loadComponent: () => import('./progress-indicator/progress-indicator.page'),
  },
  {
    path: 'ripple',
    title: 'Ripple',
    loadComponent: () => import('./ripple/ripple.page'),
  },
  {
    path: 'segmented-button',
    title: 'Segmented Button',
    loadComponent: () => import('./segmented-button/segmented-button.page'),
  },
  {
    path: 'sheet',
    title: 'Sheet',
    loadComponent: () => import('./sheet/sheet.page'),
  },
  {
    path: 'snack-bar',
    title: 'Snack Bar',
    loadComponent: () => import('./snack-bar/snack-bar.page'),
  },
  {
    path: 'tabs',
    title: 'Tabs',
    loadComponent: () => import('./tabs/tabs.page'),
  },
  {
    path: 'text-field',
    title: 'Text Field',
    loadComponent: () => import('./text-field/text-field.page'),
  },
  {
    path: 'time-picker',
    title: 'Time Picker',
    loadComponent: () => import('./time-picker/time-picker.page'),
  },
  {
    path: 'tooltip',
    title: 'Tooltip',
    loadComponent: () => import('./tooltip/tooltip.page'),
  },
  {
    path: 'typescale',
    title: 'Typescale',
    loadComponent: () => import('./typescale/typescale.page'),
  },
] satisfies Routes;
