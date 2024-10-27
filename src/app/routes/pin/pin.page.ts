import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  TextFieldComponent,
  IconComponent,
  FieldVariant,
  TextFieldType,
  PinFieldComponent,
  ButtonComponent,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { PageComponent } from '../../components/page/page.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './pin.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    PinFieldComponent,
    IconComponent,
    CommonModule,
    SelectorListItemComponent,
    ButtonComponent
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly variant = options<FieldVariant>('filled', 'outlined');
  readonly error = signal(false);
  readonly disabled = signal(false);
  readonly supportingText = signal(false);
  readonly length = options(3, 4, 5, 6);
}
