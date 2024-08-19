import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core';
import { SheetDock } from '../../../../../library/dist';

@Component({
  templateUrl: './index.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'tw flex flex-col gap-4'
  }
})
export default class Page {
  readonly dock = signal<SheetDock>('start');

  rotateDock(): void {
    const docks: SheetDock[] = ['top', 'end', 'bottom', 'start'];
    const index = docks.indexOf(this.dock());
    this.dock.set(docks[(index + 1) % docks.length]);
  }
}