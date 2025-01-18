import { NgModule } from '@angular/core';
import { MdButtonLeadingDirective } from './button-leading.directive';
import { MdButtonTrailingDirective } from './button-trailing.directive';
import { MdButtonComponent } from './button.component';

@NgModule({
  imports: [
    MdButtonComponent,
    MdButtonLeadingDirective,
    MdButtonTrailingDirective,
  ],
  exports: [
    MdButtonComponent,
    MdButtonLeadingDirective,
    MdButtonTrailingDirective,
  ],
})
export class MdButtonModule {}
