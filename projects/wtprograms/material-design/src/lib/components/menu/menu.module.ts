import { NgModule } from '@angular/core';
import { MdMenuComponent } from './menu.component';
import { MdMenuItemComponent } from './menu-item/menu-item.component';
import { MdMenuItemLeadingDirective } from './menu-item/menu-item-leading.directive';
import { MdMenuItemTrailingDirective } from './menu-item/menu-item-trailing.directive';

@NgModule({
  imports: [
    MdMenuItemLeadingDirective,
    MdMenuItemTrailingDirective,
    MdMenuComponent,
    MdMenuItemComponent,
  ],
  exports: [
    MdMenuItemLeadingDirective,
    MdMenuItemTrailingDirective,
    MdMenuComponent,
    MdMenuItemComponent,
  ],
})
export class MdMenuModule {}
