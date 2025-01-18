import { NgModule } from '@angular/core';
import { MdDialogIconDirective } from './dialog-icon.directive';
import { MdDialogComponent } from './dialog.component';
import { MdDialogActionDirective } from './dialog-action/dialog-action.directive';
import { MdDialogHeadlineComponent } from './dialog-headline/dialog-headline.component';
import { MdDialogSupportingTextComponent } from './dialog-supporting-text/dialog-supporting-text.component';


@NgModule({
  imports: [
    MdDialogComponent,
    MdDialogHeadlineComponent,
    MdDialogSupportingTextComponent,
    MdDialogIconDirective,
    MdDialogActionDirective,
  ],
  exports: [
    MdDialogComponent,
    MdDialogHeadlineComponent,
    MdDialogSupportingTextComponent,
    MdDialogIconDirective,
    MdDialogActionDirective,
  ],
})
export class MdDialogModule {}
