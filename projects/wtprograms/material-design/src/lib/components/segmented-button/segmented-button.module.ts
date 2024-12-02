import { NgModule } from '@angular/core';
import { MdSegmentedButtonComponent } from './segmented-button.component';
import { MdSegmentedButtonSetComponent } from './segmented-button-set/segmented-button-set.component';
import { MdSegmentedButtonLeadingDirective } from './segmented-button-leading.directive';
import { MdSegmentedButtonTrailingDirective } from './segmented-button-trailing.directive';

@NgModule({
  imports: [
    MdSegmentedButtonLeadingDirective,
    MdSegmentedButtonTrailingDirective,
    MdSegmentedButtonComponent,
    MdSegmentedButtonSetComponent,
  ],
  exports: [
    MdSegmentedButtonLeadingDirective,
    MdSegmentedButtonTrailingDirective,
    MdSegmentedButtonComponent,
    MdSegmentedButtonSetComponent,
  ],
})
export class MdSegmentedButtonModule {}
