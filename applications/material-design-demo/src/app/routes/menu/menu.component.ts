import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  templateUrl: './menu.component.html',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'tw relative flex flex-col h-full'
  }
})
export default class MenuComponent {}
