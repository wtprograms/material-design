import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { IconComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/icon/icon.component';
import { options } from '../../common/options';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './icon.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    IconComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly size = options(24, 40, 64, 72);
  readonly filled = signal(false);
  readonly number = options<number | undefined>(undefined, 1, 12, 123, 1234);
  readonly dot = signal(false);
}
