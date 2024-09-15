import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  templateUrl: './index.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class Page {
  readonly populated = signal(false);
  readonly isOutlined = signal(false);
  readonly disabled = signal(false);
  readonly isError = signal(false);
  readonly variant = computed(() => this.isOutlined() ? 'outlined' : 'filled');
  readonly errorText = computed(() => this.isError() ? 'Error message' : undefined);
}