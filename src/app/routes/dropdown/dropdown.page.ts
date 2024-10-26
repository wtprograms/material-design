import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  ListItemComponent,
  CardComponent,
  CheckComponent,
  DropdownComponent,
  IconComponent,
  FieldVariant,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { PageComponent } from '../../components/page/page.component';
import { SelectorListItemComponent } from '../../components/selector-list-item/selector-list-item.component';

@Component({
  templateUrl: './dropdown.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    ListItemComponent,
    CardComponent,
    CheckComponent,
    DropdownComponent,
    ListItemComponent,
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
  readonly prefix = signal(false);
  readonly suffix = signal(false);
  readonly leading = signal(false);
  readonly label = signal(false);
  readonly error = signal(false);
  readonly disabled = signal(false);
  readonly supportingText = signal(false);
  readonly counter = signal(false);

  readonly selectedValue = signal<string | undefined>('Two');
  readonly selectedValueText = computed(() =>
    this.selectedValue()
      ? `Selected value: ${this.selectedValue()}`
      : 'No value selected'
  );
}
