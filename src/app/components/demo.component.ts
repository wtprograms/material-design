import { Component, ViewEncapsulation } from '@angular/core';
import { MdCardModule } from '@wtprograms/material-design';

@Component({
  selector: 'app-demo',
  template: `
    <md-card class="flex-row p-0 overflow-hidden grow">
      <div class="inline-flex gap-4 p-2 ps-4 grow">
        <ng-content select=".demo-body" />
      </div>
      <ng-content select="app-properties" />
    </md-card>
  `,
  styles: `
    app-demo {
      flex-grow: 1;
      display: inline-flex;
    }

    .demo-body {
      display: flex;
      flex-direction: row;
      gap: 16px;
      padding: 8px;
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [MdCardModule],
})
export class DemoComponent {}
