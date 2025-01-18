import { NgModule } from '@angular/core';
import { MdDropDownFieldSelectedDirective } from './drop-down-field-selected.directive';
import { MdDropDownFieldComponent } from './drop-down-field.component';
import { MdListModule } from '../list/list.module';
import { MdFieldModule } from '../field/field.module';

@NgModule({
  imports: [MdDropDownFieldComponent, MdDropDownFieldSelectedDirective],
  exports: [
    MdDropDownFieldComponent,
    MdDropDownFieldSelectedDirective,
    MdListModule,
    MdFieldModule,
  ],
})
export class MdDropDownFieldModule {}
