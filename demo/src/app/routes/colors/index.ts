import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  templateUrl: './index.html',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'tw flex flex-col gap-4'
  }
})
export default class Page {
  palettes = [
    'primary',
    'secondary',
    'tertiary',
    'error'
  ];

  variants = [
    '',
    'container',
    'fixed',
    'fixed-dim',
    'fixed-variant',
    'inverse'
  ];

  surfaces = [
    ['surface', 'surface-on'],
    ['surface-on', 'surface'],
    ['surface-variant', 'surface-variant-on'],
    ['surface-container-highest', 'surface-on'],
    ['surface-container-high', 'surface-on'],
    ['surface-container', 'surface-on'],
    ['surface-container-low', 'surface-on'],
    ['surface-container-lowest', 'surface-on'],
    ['surface-dim', 'surface-on'],
    ['surface-bright', 'surface-on'],
    ['surface-tint', 'surface-on'],
    ['surface-inverse', 'surface-inverse-on'],
    ['surface-inverse-on', 'surface-inverse'],
  ]

  getBackground(palette: string, variant: string) {
    variant = variant ? `-${variant}` : '';
    return {
      background: `var(--md-sys-color-${palette}${variant})`,
      color: `var(--md-sys-color-${palette}${variant}-on)`
    };
  }

  getText(palette: string, variant: string) {
    variant = variant ? `-${variant}` : '';
    return {
      background: `var(--md-sys-color-${palette}${variant}-on)`,
      color: `var(--md-sys-color-${palette}${variant})`
    };
  }

  getStyle(background: string, color: string) {
    return {
      background: `var(--md-sys-color-${background})`,
      color: `var(--md-sys-color-${color})`,
    };
  }
}