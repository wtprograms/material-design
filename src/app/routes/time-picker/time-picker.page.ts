import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  TimePickerComponent,
  IconComponent,
  DatePickerVariant,
  FieldVariant,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { PageComponent } from '../../components/page/page.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './time-picker.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    SelectorListItemComponent,
    TimePickerComponent,
    IconComponent,
    CommonModule,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly variant = options<DatePickerVariant>(
    'embedded',
    'dialog',
    'dropdown'
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
  readonly timeOfDay = signal(false);
  readonly hours = signal(true);
  readonly seconds = signal(false);
}
