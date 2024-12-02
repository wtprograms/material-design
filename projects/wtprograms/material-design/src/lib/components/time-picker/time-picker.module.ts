import { NgModule } from '@angular/core';
import { MdFieldModule } from '../field/field.module';
import { MdTimePickerComponent } from './time-picker.component';

@NgModule({
  imports: [MdTimePickerComponent],
  exports: [MdTimePickerComponent, MdFieldModule],
})
export class MdTimePickerModule {}
