import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { options } from '../../common/options';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  BadgeComponent,
} from '@wtprograms/material-design';
import { PageComponent } from '../../components/page/page.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

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
    SelectorListItemComponent,
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
