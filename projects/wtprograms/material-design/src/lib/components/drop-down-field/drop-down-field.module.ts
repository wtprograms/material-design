import { NgModule } from '@angular/core';
import { MdDropDownFieldComponent } from './drop-down-field.component';
import { MdListModule } from '../list/list.module';
import { MdFieldModule } from '../field/field.module';

@NgModule({
  imports: [MdDropDownFieldComponent],
  exports: [MdDropDownFieldComponent, MdListModule, MdFieldModule],
})
export class MdDropDownFieldModule {}
