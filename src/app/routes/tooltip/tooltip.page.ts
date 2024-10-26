import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Placement } from '@floating-ui/dom';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  TooltipComponent,
  ButtonComponent,
  TooltipVariant,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { PageComponent } from '../../components/page/page.component';
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
