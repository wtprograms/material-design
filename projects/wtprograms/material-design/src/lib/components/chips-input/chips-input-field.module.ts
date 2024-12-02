import { NgModule } from '@angular/core';
import { MdChipsInputFieldComponent } from './chips-input-field.component';
import { MdChipModule } from '../chip/chip.module';
import { MdFieldModule } from '../field/field.module';
import { MdListModule } from '../list/list.module';

@NgModule({
  imports: [MdChipsInputFieldComponent],
  exports: [MdFieldModule, MdChipsInputFieldComponent, MdListModule, MdChipModule],
})
export class MdChipsInputFieldModule {}
