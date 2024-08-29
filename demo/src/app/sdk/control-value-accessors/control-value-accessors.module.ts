import { NgModule } from '@angular/core';
import { FormGroupInvalidatorDirective } from './form-group-invalidator.directive';
import { TextFieldControlDirective } from './text-field-control.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [FormGroupInvalidatorDirective, TextFieldControlDirective],
  exports: [FormGroupInvalidatorDirective, TextFieldControlDirective, FormsModule, ReactiveFormsModule],
})
export class ControlValueAccessorsModule {}