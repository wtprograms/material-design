import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import {
  PopoverComponent,
  PopoverTrigger,
} from '../../../../projects/wtprograms/material-design/src/lib/components/popover/popover.component';
import { options } from '../../common/options';
import { ButtonComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/button/button.component';
import { Placement } from '@floating-ui/dom';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './popover.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    PopoverComponent,
    ButtonComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly trigger = options<PopoverTrigger>('click', 'hover', 'contextmenu');
  readonly native = signal(false);
  readonly placement = options<Placement>(
    'bottom',
    'bottom-end',
    'bottom-start',
    'left',
    'left-end',
    'left-start',
    'right-end',
    'right-start',
    'top',
    'top-end',
    'top-start'
  );
  readonly offset = signal(false);
}
