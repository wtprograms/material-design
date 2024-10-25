import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { options } from '../../common/options';
import { ButtonComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/button/button.component';
import { Placement } from '@floating-ui/dom';
import {
  TooltipComponent,
  TooltipVariant,
} from '../../../../projects/wtprograms/material-design/src/lib/components/tooltip/tooltip.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './tooltip.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    TooltipComponent,
    ButtonComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly variant = options<TooltipVariant>('plain', 'rich');
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
}
