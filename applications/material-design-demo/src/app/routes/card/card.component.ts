import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  templateUrl: './card.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class CardComponent {}
