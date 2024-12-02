import { NgModule } from '@angular/core';
import { MdDatePickerComponent } from './date-picker.component';
import { MdFieldModule } from '../field/field.module';

@NgModule({
  imports: [MdDatePickerComponent],
  exports: [MdDatePickerComponent, MdFieldModule],
})
export class MdDatePickerModule {}
