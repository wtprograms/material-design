import { NgModule } from '@angular/core';
import { MdChipsFieldComponent } from './chips-field.component';
import { MdFieldModule } from '../field/field.module';
import { MdChipModule } from '../chip/chip.module';

export * from './chips-field.component';

@NgModule({
  imports: [MdChipsFieldComponent],
  exports: [MdChipsFieldComponent, MdChipModule, MdFieldModule],
})
export class MdChipsFieldModule {}
