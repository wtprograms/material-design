import { NgModule } from '@angular/core';
import { MdNavigationLabelDirective } from './navigation-item/navigation-item-label.directive';
import { MdNavigationIconDirective } from './navigation-item/navigation-item-icon.directive';
import { MdNavigationItemComponent } from './navigation-item/navigation-item.component';
import { MdNavigationComponent } from './navigation.component';
import { MdNavigationHeadlineComponent } from './navigation-headline/navigation-headline.component';
import { MdDividerModule } from '@wtprograms/material-design';

@NgModule({
  imports: [
    MdNavigationLabelDirective,
    MdNavigationIconDirective,
    MdNavigationItemComponent,
    MdNavigationComponent,
    MdNavigationHeadlineComponent,
  ],
  exports: [
    MdNavigationLabelDirective,
    MdNavigationIconDirective,
    MdNavigationItemComponent,
    MdNavigationComponent,
    MdNavigationHeadlineComponent,
    MdDividerModule
  ],
})
export class MdNavigationModule {}
