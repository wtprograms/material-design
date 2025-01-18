import { NgModule } from '@angular/core';
import { MdFieldModule } from '../field/field.module';
import { MdDatePickerComponent } from './date-picker.component';

@NgModule({
  imports: [MdDatePickerComponent],
  exports: [MdDatePickerComponent, MdFieldModule],
})
export class MdDatePickerModule {}
