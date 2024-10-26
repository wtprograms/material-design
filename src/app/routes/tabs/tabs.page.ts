import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  TabComponent,
  TabsComponent,
  IconComponent,
} from '@wtprograms/material-design';
import { PageComponent } from '../../components/page/page.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './tabs.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    SelectorListItemComponent,
    TabComponent,
    TabsComponent,
    IconComponent,
    CommonModule,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly secondary = signal(false);
  readonly disabled = signal(false);
  readonly icon = signal(true);
  readonly label = signal(true);
}
