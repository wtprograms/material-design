import { NgModule } from '@angular/core';
import { MdAppBarComponent } from './app-bar.component';
import { MdAppBarLeadingDirective } from './app-bar-leading.directive';
import { MdAppBarTrailingDirective } from './app-bar-trailing.directive';
import { MdIconButtonModule } from '../icon-button/icon-button.module';
import { MdFabModule } from '../fab/fab.module';
import { MdIconModule } from '../icon/icon.module';

@NgModule({
  imports: [
    MdAppBarComponent,
    MdAppBarLeadingDirective,
    MdAppBarTrailingDirective,
  ],
  exports: [
    MdAppBarComponent,
    MdAppBarLeadingDirective,
    MdAppBarTrailingDirective,
    MdIconButtonModule,
    MdFabModule,
    MdIconModule
  ],
})
export class MdAppBarModule {}
