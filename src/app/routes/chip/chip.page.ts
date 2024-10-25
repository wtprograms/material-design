import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';
import { ChipComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/chip/chip.component';
import { IconComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/icon/icon.component';
import { options } from '../../common/options';
import { AvatarComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/avatar/avatar.component';

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
