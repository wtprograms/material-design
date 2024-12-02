import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { MdListModule, MdMenuModule } from '@wtprograms/material-design';

@Component({
  selector: 'app-property',
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
    @let _options = options(); @if (_options) {
    <md-list-item #listItem [interactive]="true">
      <span><ng-container *ngTemplateOutlet="content" />: {{ option() }}</span>
      <md-icon-button mdListItemTrailing>arrow_drop_down</md-icon-button>
    </md-list-item>
    <md-menu [target]="listItem" [useTargetWidth]="true">
        @for (item of options(); track $index) {
        <md-menu-item
          (click)="option.set(item)"
          [selected]="item === option()"
          >{{ item }}</md-menu-item
        >
        }
      </md-menu>
    } @else {
    <md-list-item [interactive]="true">
      <md-check
        mdListItemTrailing
        [switch]="true"
        [(checked)]="checked"
      />
      <span>
        <ng-container *ngTemplateOutlet="content" />
      </span>
    </md-list-item>
    }
  `,
  imports: [MdMenuModule, MdListModule, CommonModule],
  host: {
    class: 'inline-flex grow'
  }
})
export class PropertyComponent {
  readonly options = input<unknown[]>();
  readonly option = model<unknown>(this.options()?.[0]);
  readonly checked = model(false);
}
