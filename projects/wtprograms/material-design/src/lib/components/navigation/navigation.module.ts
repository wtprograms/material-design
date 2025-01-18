import { NgModule } from '@angular/core';
import { MdNavigationComponent } from './navigation.component';
import { MdNavigationItemComponent } from './navigation-item/navigation-item.component';
import { MdNavigationSubHeaderComponent } from './navigation-sub-header/navigation-sub-header.component';

@NgModule({
  imports: [
    MdNavigationItemComponent,
    MdNavigationComponent,
    MdNavigationSubHeaderComponent,
  ],
  exports: [
    MdNavigationItemComponent,
    MdNavigationComponent,
    MdNavigationSubHeaderComponent,
  ],
})
export class MdNavigationModule {}
