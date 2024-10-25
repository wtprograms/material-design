import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import {
  SheetComponent,
  SheetPosition,
} from '../../../../projects/wtprograms/material-design/src/lib/components/sheet/sheet.component';
import { options } from '../../common/options';
import { IconComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/icon/icon.component';
import { ButtonComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/button/button.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './sheet.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    SheetComponent,
    IconComponent,
    ButtonComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly position = options<SheetPosition>('start', 'top', 'end', 'bottom');
  readonly modal = signal(false);
  readonly largeContent = signal(false);
  readonly icon = signal(true);
  readonly headline = signal(true);
  readonly supportingText = signal(true);
  readonly actions = signal(true);
}
