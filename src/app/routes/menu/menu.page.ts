import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { MenuComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/menu/menu.component';
import { MenuItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/menu-item/menu-item.component';
import { IconComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/icon/icon.component';
import { DividerComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/divider/divider.component';
import { ButtonComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/button/button.component';

@Component({
  templateUrl: './menu.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    MenuComponent,
    MenuItemComponent,
    IconComponent,
    DividerComponent,
    ButtonComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly leading = signal(false);
  readonly trailing = signal(false);
  readonly selected = signal(false);
  readonly disabled = signal(false);
  readonly checkOnSelected = signal(false);
}
