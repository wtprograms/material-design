import { NgModule } from '@angular/core';
import { MdDialogComponent } from './dialog.component';
import { MdDialogHeadlineDirective } from './dialog-headline.directive';
import { MdDialogIconDirective } from './dialog-icon.directive';
import { MdDialogSupportingTextDirective } from './dialog-supporting-text.directive';
import { MdDialogActionDirective } from './dialog-action.directive';
import { MdButtonModule } from '../button/button.module';

@NgModule({
  imports: [
    MdDialogHeadlineDirective,
    MdDialogIconDirective,
    MdDialogSupportingTextDirective,
    MdDialogActionDirective,
    MdDialogComponent,
  ],
  exports: [
    MdDialogHeadlineDirective,
    MdDialogIconDirective,
    MdDialogSupportingTextDirective,
    MdDialogActionDirective,
    MdDialogComponent,
    MdButtonModule
  ],
})
export class MdDialogModule {}
