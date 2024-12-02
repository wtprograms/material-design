import { Component, contentChildren, effect } from '@angular/core';
import { MdListItemComponent, MdListModule } from '@wtprograms/material-design';

@Component({
  selector: 'app-properties',
  template: `
    <md-list class="inline-flex flex-col bg-surface-container border-s border-s-outline-variant">
      <ng-content />
    </md-list>`,
  imports: [MdListModule],
  host: {
    class: 'tw contents'
  }
})
export class PropertiesComponent {
  private readonly _items = contentChildren(MdListItemComponent);

  constructor() {
    effect(() => {
      for (const item of this._items()) {
        item.interactive.set(true);
      }
    });
  }
}
