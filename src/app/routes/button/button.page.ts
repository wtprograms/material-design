import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import {
  ButtonComponent,
  ButtonVariant,
} from '../../../../projects/wtprograms/material-design/src/lib/components/button/button.component';
import { IconComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/icon/icon.component';
import { options } from '../../common/options';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './button.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    ButtonComponent,
    IconComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly variant = options<ButtonVariant>(
    'elevated',
    'filled',
    'tonal',
    'outlined',
    'text',
    'plain'
  );
  readonly disabled = signal(false);
  readonly progressIndeterminate = signal(false);
  readonly leading = signal(false);
  readonly trailing = signal(false);
}
