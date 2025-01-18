import { NgModule } from '@angular/core';
import { MdTimePickerComponent } from './time-picker.component';
import { MdFieldModule } from '../field/field.module';

@NgModule({
  imports: [MdTimePickerComponent],
  exports: [MdTimePickerComponent, MdFieldModule],
})
export class MdTimePickerModule {}
