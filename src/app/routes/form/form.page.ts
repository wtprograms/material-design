import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ButtonComponent,
  CardComponent,
  catchFormValidationError,
  CheckComponent,
  DatePickerComponent,
  DropdownComponent,
  MdFormsModule,
  PinFieldComponent,
  TextFieldComponent,
  TimePickerComponent,
  ValidationError,
} from '@wtprograms/material-design';
import { PageComponent } from '../../components/page/page.component';
import { delay, of, tap } from 'rxjs';

@Component({
  templateUrl: './form.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageComponent,
    TextFieldComponent,
    PinFieldComponent,
    CheckComponent,
    DropdownComponent,
    DatePickerComponent,
    TimePickerComponent,
    CommonModule,
    CardComponent,
    ButtonComponent,
    MdFormsModule
  ],
  host: {
    class: 'tw w-full',
  },
})
export default class Page {
  readonly form = new FormGroup({
    text1: new FormControl(undefined, {
      validators: [Validators.required],
    }),
    text2: new FormControl(undefined, {
      validators: [Validators.required],
    }),
    pin: new FormControl(undefined, {
      validators: [Validators.required],
    }),
    checkbox: new FormControl(false),
    radio: new FormControl()
  });

  readonly value = signal<any>(undefined);
  readonly isSubmitting = signal(false);

  submit() {
    of({}).pipe(
      tap(() => this.isSubmitting.set(true)),
      delay(1000),
      tap(() => { throw new ValidationError('text1', 'This is a custom error message'); }),
      catchFormValidationError(this.form, () => this.isSubmitting.set(false)),
      tap(() => {
        this.value.set(this.form.getRawValue());
        this.isSubmitting.set(false);
      }),
    ).subscribe();
  }
}
