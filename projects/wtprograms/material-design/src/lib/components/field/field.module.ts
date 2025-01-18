import { NgModule } from '@angular/core';
import { MdFieldLeadingDirective } from './field-leading.directive';
import { MdFieldSupportingTextDirective } from './field-supporting-text.directive';
import { MdFieldTrailingDirective } from './field-trailing.directive';
import { MdFieldComponent } from './field.component';
import { MdFieldPopoverContentComponent } from './field-popover-content/field-popover-content.component';

@NgModule({
  imports: [
    MdFieldLeadingDirective,
    MdFieldSupportingTextDirective,
    MdFieldTrailingDirective,
    MdFieldComponent,
    MdFieldPopoverContentComponent,
  ],
  exports: [
    MdFieldLeadingDirective,
    MdFieldSupportingTextDirective,
    MdFieldTrailingDirective,
    MdFieldComponent,
    MdFieldPopoverContentComponent,
  ],
})
export class MdFieldModule {}
