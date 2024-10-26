import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  MenuComponent,
  MenuItemComponent,
  IconComponent,
  DividerComponent,
  ButtonComponent,
} from '@wtprograms/material-design';
import { PageComponent } from '../../components/page/page.component';

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
