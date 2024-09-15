import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  templateUrl: './index.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class Page {
  readonly variants: string[] = ['elevated', 'filled', 'tonal', 'outlined', 'text', 'plain'];
  readonly variant = signal<string>('elevated');
  readonly disabled = signal(false);
  readonly busy = signal(false);

  nextVariant() {
    const currentIndex = this.variants.indexOf(this.variant());
    this.variant.set(this.variants[(currentIndex + 1) % this.variants.length]);
  }
}