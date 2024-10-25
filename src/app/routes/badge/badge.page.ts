import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { BadgeComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/badge/badge.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';
import { options } from '../../common/options';

@Component({
  templateUrl: './badge.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    BadgeComponent,
    SelectorListItemComponent
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly number = options<number | undefined>(1, 12, 123, 1234, undefined);
  readonly dot = signal(false);
  readonly embedded = signal(false);
}
 