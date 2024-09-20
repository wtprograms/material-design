import { Component, signal } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IconButtonVariant } from '../../../../../dist';

@Component({
  templateUrl: './index.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class Page {
  readonly variants: IconButtonVariant[] = ['filled', 'tonal', 'outlined', 'standard'];
  readonly variant = signal<IconButtonVariant>('filled');
  readonly disabled = signal(false);
  readonly selected = signal(false);
  readonly busy = signal(false);

  nextVariant() {
    const currentIndex = this.variants.indexOf(this.variant());
    this.variant.set(this.variants[(currentIndex + 1) % this.variants.length]);
  }
}
