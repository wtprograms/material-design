import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { AppModule } from '../../components/app-components';
import { MdAccordionModule } from '@wtprograms/material-design';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-entry',
  template: `
    <ng-content />
  `,
  host: {
    '[style.background-color]': 'backgroundVar()',
    '[style.color]': 'colorVar()',
    'class': 'p-1 text-small'
  }
})
export class ColorEntryComponent {
  readonly background = input('');
  readonly color = input('');

  readonly backgroundVar = computed(() => `var(--md-sys-color-${this.background()}`);
  readonly colorVar = computed(() => `var(--md-sys-color-${this.color()}`);
}

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppModule, MdAccordionModule, FormsModule, ColorEntryComponent],
})
export default class Page {
  readonly dark = signal(false);
  readonly hue = signal(250);
  readonly saturation = signal(80);
}
