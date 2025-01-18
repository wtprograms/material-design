import { NgModule } from '@angular/core';
import { MdSheetComponent } from './sheet.component';
import { MdSheetActionDirective } from './sheet-action/sheet-action.directive';
import { MdSheetHeadlineComponent } from './sheet-headline/sheet-headline.component';

@NgModule({
  imports: [MdSheetComponent, MdSheetHeadlineComponent, MdSheetActionDirective],
  exports: [MdSheetComponent, MdSheetHeadlineComponent, MdSheetActionDirective],
})
export class MdSheetModule {}
