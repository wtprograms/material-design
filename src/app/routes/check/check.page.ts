import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { options } from '../../common/options';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  CheckType,
} from '@wtprograms/material-design';
import { PageComponent } from '../../components/page/page.component';

@Component({
  templateUrl: './check.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly type = options<CheckType>('checkbox', 'radio');
  readonly disabled = signal(false);
  readonly switch = signal(false);
  readonly label = signal(false);
  readonly error = signal(false);
}
