import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { options } from '../../common/options';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  ChipComponent,
  IconComponent,
  AvatarComponent,
} from '@wtprograms/material-design';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './chip.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    SelectorListItemComponent,
    ChipComponent,
    IconComponent,
    AvatarComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly selected = signal(false);
  readonly leading = options(undefined, 'avatar', 'icon');
  readonly trailing = signal(false);
  readonly pill = signal(false);
  readonly disabled = signal(false);
  readonly closable = signal(false);
}
