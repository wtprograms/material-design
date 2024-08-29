import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FieldVariant } from '../../../../../dist';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorsModule } from '../../sdk/control-value-accessors/control-value-accessors.module';

@Component({
  templateUrl: './index.html',
  standalone: true,
  imports: [CommonModule, ControlValueAccessorsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'tw flex flex-col gap-4'
  }
})
export default class Page {
  readonly variants: FieldVariant[] = ['filled', 'outlined'];

  readonly formGroup = new FormGroup({
    value: new FormControl('This is some value.')
  });
}