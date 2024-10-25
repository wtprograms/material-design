import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { SegmentedButtonComponent, SegmentedButtonType } from '../../../../projects/wtprograms/material-design/src/lib/components/segmented-button/segmented-button.component';
import { IconComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/icon/icon.component';
import { SegmentedButtonSetComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/segmented-button-set/segmented-button-set.component';
import { options } from '../../common/options';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './segmented-button.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    SegmentedButtonComponent,
    SegmentedButtonSetComponent,
    IconComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly leading = signal(false);
  readonly trailing = signal(false);
  readonly disabled = signal(false);
  readonly selected = signal(false);
  readonly checkOnSelected = signal(false);
  readonly number = options<number | undefined>(undefined, 1, 12, 123, 1234);
  readonly dot = signal(false);
  readonly buttons = options(
    [1],
    [2, 2],
    [3, 3, 3]
  );
  readonly type = options<SegmentedButtonType>('button', 'checkbox', 'radio');
}
