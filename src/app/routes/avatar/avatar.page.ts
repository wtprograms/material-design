import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { options } from '../../common/options';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';
import {
  AvatarComponent,
  CheckComponent,
  CardComponent,
  ListItemComponent,
  AvatarPalette,
} from '@wtprograms/material-design';
import { PageComponent } from '../../components/page/page.component';

@Component({
  templateUrl: './avatar.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarComponent,
    PageComponent,
    CheckComponent,
    CardComponent,
    ListItemComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly palette = options<AvatarPalette>(
    'surface',
    'primary',
    'secondary',
    'tertiary',
    'plain'
  );
  readonly size = options(56, 72, 32, 48);
  readonly disabled = signal(false);
  readonly interactive = signal(false);
  readonly progressIndeterminate = signal(false);
}
