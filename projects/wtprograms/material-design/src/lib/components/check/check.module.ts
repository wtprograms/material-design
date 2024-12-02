import { NgModule } from '@angular/core';
import { MdCheckComponent } from './check.component';
import { MdCheckCheckedIconDirective } from './check-checked-icon.directive';
import { MdCheckIndeterminateIconDirective } from './check-indeterminate-icon.directive';
import { MdCheckUncheckedIconDirective } from './check-unchecked-icon.directive';
import { MdIconModule } from '../icon/icon.module';

@NgModule({
  imports: [MdCheckCheckedIconDirective, MdCheckIndeterminateIconDirective, MdCheckUncheckedIconDirective, MdCheckComponent],
  exports: [MdCheckCheckedIconDirective, MdCheckIndeterminateIconDirective, MdCheckUncheckedIconDirective, MdCheckComponent, MdIconModule]
})
export class MdCheckModule {}