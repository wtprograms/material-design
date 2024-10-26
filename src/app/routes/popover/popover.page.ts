import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Placement } from '@floating-ui/dom';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  PopoverComponent,
  ButtonComponent,
  PopoverTrigger,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { PageComponent } from '../../components/page/page.component';
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
