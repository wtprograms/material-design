import { NgModule } from '@angular/core';
import { MdRippleComponent } from './ripple.component';

export * from './ripple.component';

@NgModule({
  imports: [MdRippleComponent],
  exports: [MdRippleComponent],
})
export class MdRippleModule {}
