import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { ButtonVariant } from '../../../../../library/dist';
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
  ]
}