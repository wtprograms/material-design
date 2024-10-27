import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
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
    CardComponent
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
}
