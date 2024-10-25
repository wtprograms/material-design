import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { options } from '../../common/options';
import {
  IconButtonComponent,
  IconButtonVariant,
} from '../../../../projects/wtprograms/material-design/src/lib/components/icon-button/icon-button.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './icon-button.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    IconButtonComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly variant = options<IconButtonVariant>(
    'standard',
    'tonal',
    'filled',
    'outlined'
  );
  readonly disabled = signal(false);
  readonly progressIndeterminate = signal(false);
  readonly selected = signal(false);
  readonly number = options<number | undefined>(undefined, 1, 12, 123, 1234);
  readonly dot = signal(false);
}
