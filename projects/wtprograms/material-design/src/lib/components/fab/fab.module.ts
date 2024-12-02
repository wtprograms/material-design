import { NgModule } from '@angular/core';
import { MdFabComponent } from './fab.component';
import { MdFabIconDirective } from './fab-icon.directive';
import { MdFabLabelDirective } from './fab-label.directive';
import { MdIconModule } from '../icon/icon.module';

@NgModule({
  imports: [MdFabIconDirective, MdFabLabelDirective, MdFabComponent, MdIconModule],
  exports: [MdFabIconDirective, MdFabLabelDirective, MdFabComponent, MdIconModule],
})
export class MdFabModule {}