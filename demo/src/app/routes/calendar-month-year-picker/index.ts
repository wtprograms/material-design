import { Component, signal } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  templateUrl: './index.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class Page {
  readonly today = new Date().toISOString();
}
