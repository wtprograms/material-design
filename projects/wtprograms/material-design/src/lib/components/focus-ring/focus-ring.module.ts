import { NgModule } from '@angular/core';
import { MdFocusRingComponent } from './focus-ring.component';

export * from './focus-ring.component';

@NgModule({
  imports: [MdFocusRingComponent],
  exports: [MdFocusRingComponent],
})
export class MdFocusRingModule {}
