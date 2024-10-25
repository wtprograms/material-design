import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { IconComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/icon/icon.component';
import { AvatarComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/avatar/avatar.component';
import { options } from '../../common/options';
import { ListComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list/list.component';
import { CommonModule } from '@angular/common';
import { DividerComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/divider/divider.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './list.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    IconComponent,
    CheckComponent,
    AvatarComponent,
    ListComponent,
    CommonModule,
    DividerComponent,
    SelectorListItemComponent
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly leading = options(undefined, 'icon', 'avatar', 'image');
  readonly trailing = signal(false);
  readonly supportingText = options(undefined, 'short', 'long');
  readonly top = signal(false);
  readonly large = signal(false);
  readonly interactive = signal(false);
  readonly progressIndeterminate = signal(false);
  readonly disabled = signal(false);
  readonly split = signal(false);
  readonly selected = signal(false);
}
