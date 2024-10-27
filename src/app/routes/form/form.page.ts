import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonComponent,
  CardComponent,
  CheckComponent,
  DatePickerComponent,
  DropdownComponent,
  PinFieldComponent,
  TextFieldComponent,
  TimePickerComponent,
} from '@wtprograms/material-design';
import { PageComponent } from '../../components/page/page.component';

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
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CardComponent,
    ButtonComponent
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

  setValue() {
    console.log('hey')
    this.value.set(this.form.value);
  }

  click() {
    console.log('click');
  }
}
