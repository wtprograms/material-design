import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  signal,
} from '@angular/core';
import {
  TextFieldType,
  FieldVariant,
  ControlState,
  MdIconModule,
  MdIconButtonModule,
  MdFormsModule,
  MdButtonModule,
  MdChipsFieldComponent,
  MdChipsFieldModule,
} from '@wtprograms/material-design';
import { options } from '../../common/options';
import { AppModule } from '../../components/app-components';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppModule,
    MdChipsFieldModule,
    MdIconModule,
    MdIconButtonModule,
    MdFormsModule,
    CommonModule,
    MdButtonModule,
  ],
})
export default class Page {
  readonly type = options<TextFieldType>('text', 'textarea');
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
  readonly maxLength = signal(false);

  readonly form = new FormGroup({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly formValue = signal(this.form.getRawValue());

  submit() {
    this.formValue.set(this.form.getRawValue());
  }
}
