import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { ColorEntryComponent } from '../../components/color-entry/color-entry.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './colors.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    ColorEntryComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly darkMode = signal(false);

  readonly colors = [
    ...this.theme('primary'),
    ...this.theme('secondary'),
    ...this.theme('tertiary'),
    ...this.theme('danger'),
    ...this.theme('warning'),
    ...this.theme('success'),
    ['background'],
    undefined,
    ['outline'],
    undefined,
    ['surface'],
    ['surface-variant'],
    ['surface-container-highest', 'surface-on'],
    ['surface-container-high', 'surface-on'],
    ['surface-container', 'surface-on'],
    ['surface-container-low', 'surface-on'],
    ['surface-container-lowest', 'surface-on'],
    ['surface-dim', 'surface-on'],
    ['surface-bright', 'surface-on'],
    ['surface-tint', 'surface-on'],
    ['surface-inverse'],
  ];

  private theme(name: string) {
    return [
      [name],
      [`${name}-container`],
      [`${name}-fixed`],
      [`${name}-fixed-dim`],
      [`${name}-fixed-variant`],
      [`${name}-inverse`],
      undefined,
    ];
  }
}
