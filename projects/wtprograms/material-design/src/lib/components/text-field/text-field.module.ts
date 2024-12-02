import { NgModule } from '@angular/core';
import { MdTextFieldComponent } from './text-field.component';
import { MdListModule } from '../list/list.module';
import { MdFieldModule } from '../field/field.module';

@NgModule({
  imports: [MdTextFieldComponent],
  exports: [MdFieldModule, MdTextFieldComponent, MdListModule],
})
export class MdTextFieldModule {}
