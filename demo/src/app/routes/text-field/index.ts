import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, computed, signal } from '@angular/core';

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
  readonly disabled = signal(false);
  readonly error = signal(false);
  readonly errorText = computed(() => this.error() ? 'This is an error message' : null);
}