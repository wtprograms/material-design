import { NgModule } from '@angular/core';
import { MdListComponent } from './list.component';
import { MdListItemComponent } from './list-item/list-item.component';
import { MdDividerComponent } from '../divider/divider.component';
import { MdListItemLeadingDirective } from './list-item/list-item-leading.directive';
import { MdListItemTrailingDirective } from './list-item/list-item-trailing.directive';
import { MdListItemSupportingTextDirective } from './list-item/list-item-supporting-text.directive';
import { MdCheckModule, MdIconButtonModule } from '@wtprograms/material-design';

@NgModule({
  imports: [
    MdListItemLeadingDirective,
    MdListItemTrailingDirective,
    MdListItemSupportingTextDirective,
    MdListComponent,
    MdListItemComponent,
    MdDividerComponent,
  ],
  exports: [
    MdListItemLeadingDirective,
    MdListItemTrailingDirective,
    MdListItemSupportingTextDirective,
    MdListComponent,
    MdListItemComponent,
    MdDividerComponent,
    MdCheckModule,
    MdIconButtonModule
  ],
})
export class MdListModule {}
