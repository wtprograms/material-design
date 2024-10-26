import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  IconComponent,
  AvatarComponent,
  ListComponent,
  DividerComponent,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { PageComponent } from '../../components/page/page.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './list.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    IconComponent,
    CheckComponent,
    AvatarComponent,
    ListComponent,
    CommonModule,
    DividerComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly leading = options(undefined, 'icon', 'avatar', 'image');
  readonly trailing = signal(false);
  readonly supportingText = options(undefined, 'short', 'long');
  readonly top = signal(false);
  readonly large = signal(false);
  readonly interactive = signal(false);
  readonly progressIndeterminate = signal(false);
  readonly disabled = signal(false);
  readonly split = signal(false);
  readonly selected = signal(false);
}
