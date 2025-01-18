import { NgModule } from '@angular/core';
import { MdFabComponent } from './fab.component';
import { MdFabLabelComponent } from './fab-label/fab-label.component';

@NgModule({
  imports: [MdFabComponent, MdFabLabelComponent],
  exports: [MdFabComponent, MdFabLabelComponent],
})
export class MdFabModule {}
