import { NgModule } from '@angular/core';
import { MdButtonComponent } from './button.component';
import { MdButtonLeadingDirective } from './button-leading.directive';
import { MdButtonTrailingDirective } from './button-trailing.directive';
import { MdIconModule } from '@wtprograms/material-design';

@NgModule({
  imports: [MdButtonLeadingDirective, MdButtonTrailingDirective, MdButtonComponent],
  exports: [MdButtonLeadingDirective, MdButtonTrailingDirective, MdButtonComponent, MdIconModule],
})
export class MdButtonModule {}