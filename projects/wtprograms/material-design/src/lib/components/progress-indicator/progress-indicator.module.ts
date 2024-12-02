import { NgModule } from '@angular/core';
import { MdProgressIndicatorComponent } from './progress-indicator.component';
import { MdProgressIndicatorUserDirective } from './progress-indicator-user.directive';

@NgModule({
  imports: [MdProgressIndicatorComponent, MdProgressIndicatorUserDirective],
  exports: [MdProgressIndicatorComponent, MdProgressIndicatorUserDirective],
})
export class MdProgressIndicatorModule {}