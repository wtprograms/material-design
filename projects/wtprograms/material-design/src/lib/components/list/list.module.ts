import { NgModule } from '@angular/core';
import { MdListComponent } from './list.component';
import { MdListItemSupportingText } from './list-item/list-item-supporting-text/list-item-supporting-text.component';
import { MdListItemTrailingDirective } from './list-item/list-item-trailing.directive';
import { MdListItemComponent } from './list-item/list-item.component';

@NgModule({
  imports: [
    MdListComponent,
    MdListItemComponent,
    MdListItemSupportingText,
    MdListItemTrailingDirective,
  ],
  exports: [
    MdListComponent,
    MdListItemComponent,
    MdListItemSupportingText,
    MdListItemTrailingDirective,
  ],
})
export class MdListModule {}
