import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { CardComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/card/card.component';
import { ListItemComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/list-item/list-item.component';
import { CheckComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/check/check.component';
import {
  TextFieldComponent,
  TextFieldType,
} from '../../../../projects/wtprograms/material-design/src/lib/components/text-field/text-field.component';
import { FieldVariant } from '../../../../projects/wtprograms/material-design/src/lib/components/field/field.component';
import { options } from '../../common/options';
import { IconComponent } from '../../../../projects/wtprograms/material-design/src/lib/components/icon/icon.component';
import { CommonModule } from '@angular/common';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './text-field.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    TextFieldComponent,
    IconComponent,
    CommonModule,
    SelectorListItemComponent,
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly variant = options<FieldVariant>('filled', 'outlined');
  readonly type = options<TextFieldType>(
    'text',
    'text-area',
    'email',
    'number',
    'password',
    'tel',
    'url'
  );
  readonly prefix = signal(false);
  readonly suffix = signal(false);
  readonly leading = signal(false);
  readonly trailing = signal(false);
  readonly label = signal(false);
  readonly error = signal(false);
  readonly disabled = signal(false);
  readonly supportingText = signal(false);
  readonly maxLength = signal(false);
  readonly items = signal(false);

  readonly itemValues = [
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten'
  ];
}
