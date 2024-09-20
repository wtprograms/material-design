import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { MdTabElement } from '../../../../../dist';

@Component({
  templateUrl: './index.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'tw flex flex-col gap-4'
  }
})
export default class Page {
  select(event: Event) {
    const target = event.target as MdTabElement;
    target.selected = true;
  }
}