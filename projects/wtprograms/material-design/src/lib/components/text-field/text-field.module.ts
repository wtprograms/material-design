import { NgModule } from '@angular/core';
import { MdTextFieldComponent } from './text-field.component';
import { MdListModule } from '../list/list.module';
import { MdFieldModule } from '../field/field.module';

export * from './text-field-type';
export * from './text-field.component';

@NgModule({
  imports: [MdTextFieldComponent],
  exports: [MdTextFieldComponent, MdFieldModule, MdListModule],
})
export class MdTextFieldModule {}
