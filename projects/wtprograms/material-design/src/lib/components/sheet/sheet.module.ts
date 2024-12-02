import { NgModule } from '@angular/core';
import { MdSheetComponent } from './sheet.component';
import { MdSheetActionDirective } from './sheet-action.directive';
import { MdSheetHeadlineDirective } from './sheet-headline.directive';
import { MdSheetIconDirective } from './sheet-icon.directive';
import { MdSheetSupportingTextDirective } from './sheet-supporting-text.directive';

@NgModule({
  imports: [
    MdSheetComponent,
    MdSheetActionDirective,
    MdSheetHeadlineDirective,
    MdSheetIconDirective,
    MdSheetSupportingTextDirective,
  ],
  exports: [
    MdSheetComponent,
    MdSheetActionDirective,
    MdSheetHeadlineDirective,
    MdSheetIconDirective,
    MdSheetSupportingTextDirective,
  ],
})
export class MdSheetModule {}
