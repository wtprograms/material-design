import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { MdSegmentedButtonElement } from '../../../../../library/dist';

@Component({
  templateUrl: './index.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'tw flex flex-col gap-4'
  }
})
export default class Page {
  click(event: Event): void {
    const segmentedButton = event.target as MdSegmentedButtonElement;
    segmentedButton.checked = !segmentedButton.checked;
  }
}