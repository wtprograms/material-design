import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, effect, viewChild } from '@angular/core';
import { ButtonVariant } from '../../../../../dist';
import { CommonModule } from '@angular/common';

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
  readonly variants: ButtonVariant[] = [
    'elevated',
    'filled',
    'tonal',
    'outlined',
    'text'
  ];

  readonly form = viewChild<ElementRef<HTMLFormElement>>('form');

  constructor() {
    effect(() => {
      const form = this.form();
      if (!form) {
        return;
      }
      form.nativeElement.addEventListener('submit', () => {
        console.log('Form submitted');
      });
    })
  }
}