import { NgModule } from '@angular/core';
import { MdEmbeddedButtonComponent } from './embedded-button.component';

export * from './embedded-button.component';

@NgModule({
  imports: [MdEmbeddedButtonComponent],
  exports: [MdEmbeddedButtonComponent],
})
export class MdEmbeddedButtonModule {}
