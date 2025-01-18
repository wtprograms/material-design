import { NgModule } from '@angular/core';
import { MdMenuComponent } from './menu.component';
import { MdMenuItemLeadingDirective } from './menu-item/menu-item-leading.directive';
import { MdMenuItemTrailingComponent } from './menu-item/menu-item-trailing/menu-item-trailing.component';
import { MdMenuItemComponent } from './menu-item/menu-item.component';

@NgModule({
  imports: [
    MdMenuComponent,
    MdMenuItemComponent,
    MdMenuItemLeadingDirective,
    MdMenuItemTrailingComponent,
  ],
  exports: [
    MdMenuComponent,
    MdMenuItemComponent,
    MdMenuItemLeadingDirective,
    MdMenuItemTrailingComponent,
  ],
})
export class MdMenuModule {}
