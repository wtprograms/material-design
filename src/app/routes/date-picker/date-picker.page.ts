import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';
import { DatePickerComponent, DatePickerVariant } from '../../../../projects/wtprograms/material-design/src/lib/components/date-picker/date-picker.component';
import { CommonModule } from '@angular/common';
import { options } from '../../common/options';
import { FieldVariant } from '../../../../projects/wtprograms/material-design/src/lib/components/field/field.component';
import { IconComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/icon/icon.component';

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
    IconComponent
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly variant = options<DatePickerVariant>('dropdown', 'dialog', 'embedded');
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
