import { NgModule } from '@angular/core';
import { MdFieldUserDirective } from './field-user.directive';
import { MdFieldComponent } from './field.component';
import { MdFieldLeadingDirective } from './field-leading.directive';
import { MdFieldTrailingDirective } from './field-trailing.directive';
import { MdFieldBottomDirective } from './field-bottom.directive';

@NgModule({
  imports: [
    MdFieldLeadingDirective,
    MdFieldTrailingDirective,
    MdFieldComponent,
    MdFieldUserDirective,
    MdFieldBottomDirective
  ],
  exports: [
    MdFieldLeadingDirective,
    MdFieldTrailingDirective,
    MdFieldComponent,
    MdFieldUserDirective,
    MdFieldBottomDirective
  ],
})
export class MdFieldModule {}
