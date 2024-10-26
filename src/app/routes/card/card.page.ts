import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { options } from '../../common/options';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  CardVariant,
} from '@wtprograms/material-design';

@Component({
  templateUrl: './card.page.html',
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
  readonly variant = options<CardVariant>('elevated', 'filled', 'outlined');
  readonly disabled = signal(false);
  readonly interactive = signal(false);
  readonly leading = signal(false);
  readonly trailing = signal(false);
  readonly progressIndeterminate = signal(false);
}
