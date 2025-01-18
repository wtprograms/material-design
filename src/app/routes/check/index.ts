import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CheckType,
  ControlState,
  MdButtonModule,
  MdCheckModule,
  MdFormsModule,
  MdIconModule,
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
    MdCheckModule,
    MdIconModule,
    MdFormsModule,
    MdButtonModule,
    CommonModule,
  ],
})
export default class Page {
  readonly disabled = signal(false);
  readonly state = options<ControlState>(
    undefined,
    'error',
    'success',
    'warning'
  );
  readonly switch = signal(false);
  readonly checked = signal(false);
  readonly indeterminate = signal(false);
  readonly uncheckedIcon = signal(false);
  readonly checkedIcon = signal(false);
  readonly indeterminateIcon = signal(false);

  readonly form = new FormGroup({
    agree: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
    isOn: new FormControl<number>(0),
  });

  readonly formValue = signal(this.form.getRawValue());

  submit() {
    this.formValue.set(this.form.getRawValue());
  }
}
