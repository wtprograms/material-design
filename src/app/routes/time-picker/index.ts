import { Component, computed, Directive, signal } from '@angular/core';
import {
  MdTimePickerModule,
  TextFieldType,
  DatePickerLayout,
  FieldVariant,
  ControlState,
  MdIconModule,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';

@Component({
  templateUrl: './index.html',
  imports: [AppModule, MdTimePickerModule, MdIconModule],
})
export default class Page {
  readonly type = options<TextFieldType>('text', 'textarea');
  readonly layout = options<DatePickerLayout>('field', 'embedded', 'modal');
  readonly variant = options<FieldVariant>('filled', 'outlined');
  readonly leading = options('none', 'icon', 'image', 'button');
  readonly trailing = options('none', 'icon', 'image', 'button');
  readonly state = options<ControlState>(
    undefined,
    'error',
    'warning',
    'success'
  );
  readonly label = options('none', 'short', 'long');
  readonly labelText = computed(() => {
    const label = this.label();
    if (label === 'short') {
      return 'Short label';
    } else if (label === 'long') {
      return 'Long label text';
    }
    return undefined;
  });
  readonly counter = signal(false);
  readonly supportingText = signal(false);
  readonly prefixText = signal(false);
  readonly suffixText = signal(false);
  readonly min = signal(false);
  readonly max = signal(false);
  readonly displayHours = signal(true);
  readonly displaySeconds = signal(false);
  readonly timeOfDay = signal(false);
}
