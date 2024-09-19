import {Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  FabPalette,
  FabSize,
} from '../../../../../material-design/dist';
import { CommonModule } from '@angular/common';

@Component({
  templateUrl: './index.html',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'tw flex flex-col gap-4',
  },
})
export default class Page {
  readonly palettes: FabPalette[] = [
    'surface',
    'primary',
    'secondary',
    'tertiary',
  ];

  readonly sizes: FabSize[] = ['large', 'medium', 'small'];
}
