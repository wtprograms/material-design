import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  SheetComponent,
  IconComponent,
  ButtonComponent,
  SheetPosition,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { PageComponent } from '../../components/page/page.component';
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
