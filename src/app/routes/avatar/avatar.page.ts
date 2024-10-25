import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AvatarComponent,
  AvatarPalette,
} from '../../../../projects/wtprograms/material-design/src/lib/components/avatar/avatar.component';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';
import { options } from '../../common/options';

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
