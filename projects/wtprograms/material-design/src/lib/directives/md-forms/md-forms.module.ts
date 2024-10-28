import { NgModule } from '@angular/core';
import { FormGroupResetirective } from './form-group-reset.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [FormGroupResetirective],
  exports: [
    FormGroupResetirective,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class MdFormsModule {}
