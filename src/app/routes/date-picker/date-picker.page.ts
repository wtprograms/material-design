import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  DatePickerComponent,
  IconComponent,
  DatePickerVariant,
  FieldVariant,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { PageComponent } from '../../components/page/page.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './date-picker.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    SelectorListItemComponent,
    DatePickerComponent,
    CommonModule,
    IconComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly variant = options<DatePickerVariant>(
    'dropdown',
    'dialog',
    'embedded'
  );
  readonly fieldVariant = options<FieldVariant>('filled', 'outlined');
  readonly prefix = signal(false);
  readonly suffix = signal(false);
  readonly leading = signal(false);
  readonly label = signal(false);
  readonly error = signal(false);
  readonly disabled = signal(false);
  readonly supportingText = signal(false);
  readonly counter = signal(false);
  readonly range = signal(false);
}
