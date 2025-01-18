import { NgModule } from '@angular/core';
import { MdSegmentedButtonLeadingDirective } from './segmented-button-leading.directive';
import { MdSegmentedButtonTrailingDirective } from './segmented-button-trailing.directive';
import { MdSegmentedButtonComponent } from './segmented-button.component';
import { MdSegmentedButtonSetComponent } from './segmented-button-set/segmented-button-set.component';

@NgModule({
  imports: [
    MdSegmentedButtonComponent,
    MdSegmentedButtonSetComponent,
    MdSegmentedButtonLeadingDirective,
    MdSegmentedButtonTrailingDirective,
  ],
  exports: [
    MdSegmentedButtonComponent,
    MdSegmentedButtonSetComponent,
    MdSegmentedButtonLeadingDirective,
    MdSegmentedButtonTrailingDirective,
  ],
})
export class MdSegmentedButtonModule {}
