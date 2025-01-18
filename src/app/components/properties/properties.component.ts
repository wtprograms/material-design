import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tw inline-flex flex-col self-start bg-surface-container border border-outline-variant rounded-medium'
  }
})
export class PropertiesComponent {}