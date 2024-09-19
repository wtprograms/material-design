import { Component, signal } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonVariant } from '../../../../../material-design/dist';

@Component({
  templateUrl: './index.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class Page {
  readonly variants: ButtonVariant[] = [
    'elevated',
    'filled',
    'tonal',
    'outlined',
    'text',
    'plain',
  ];
  readonly variant = signal<ButtonVariant>('elevated');
  readonly disabled = signal(false);
  readonly busy = signal(false);

  nextVariant() {
    const currentIndex = this.variants.indexOf(this.variant());
    this.variant.set(this.variants[(currentIndex + 1) % this.variants.length]);
  }
}
