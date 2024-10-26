import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  ButtonComponent,
  IconComponent,
  ButtonVariant,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { PageComponent } from '../../components/page/page.component';

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
