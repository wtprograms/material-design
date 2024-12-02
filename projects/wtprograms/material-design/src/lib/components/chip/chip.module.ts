import { NgModule } from '@angular/core';
import { MdChipComponent } from './chip.component';
import { MdChipLeadingDirective } from './chip-leading.directive';
import { MdChipTrailingDirective } from './chip-trailing.directive';

@NgModule({
  imports: [MdChipLeadingDirective, MdChipTrailingDirective, MdChipComponent],
  exports: [MdChipLeadingDirective, MdChipTrailingDirective, MdChipComponent],
})
export class MdChipModule {}
