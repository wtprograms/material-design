import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Typescale, TypescaleSize } from '../../../../../dist';

@Component({
  templateUrl: './index.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'tw flex flex-col gap-4 relative'
  }
})
export default class Page {
  readonly scales: Typescale[] = ['display', 'headline', 'title', 'label', 'body'];
  readonly sizes: TypescaleSize[] = ['large', 'medium', 'small'];
}