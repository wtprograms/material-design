import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  FabComponent,
  IconComponent,
  FabPalette,
  FabSize,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { PageComponent } from '../../components/page/page.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './fab.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    FabComponent,
    IconComponent,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly palette = options<FabPalette>(
    'surface',
    'primary',
    'secondary',
    'tertiary',
    'danger',
    'warning',
    'success'
  );
  readonly size = options<FabSize>('medium', 'small', 'large');
  readonly label = signal(true);
  readonly icon = signal(true);
  readonly lowered = signal(false);
  readonly extended = signal(true);
}
