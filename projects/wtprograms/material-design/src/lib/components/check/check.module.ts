import { NgModule } from '@angular/core';
import { MdCheckIconDirective } from './check-icon';
import { MdCheckComponent } from './check.component';

@NgModule({
  imports: [MdCheckComponent, MdCheckIconDirective],
  exports: [MdCheckComponent, MdCheckIconDirective],
})
export class MdCheckModule {}
