import { NgModule } from '@angular/core';
import { MdNavigationLabelDirective } from './navigation-item/navigation-item-label.directive';
import { MdNavigationIconDirective } from './navigation-item/navigation-item-icon.directive';
import { MdNavigationItemComponent } from './navigation-item/navigation-item.component';
import { MdNavigationComponent } from './navigation.component';
import { MdNavigationHeadlineComponent } from './navigation-headline/navigation-headline.component';
import { MdDividerModule } from '../divider/divider.module';
import { MdIconModule } from '../icon/icon.module';

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
    MdDividerModule,
    MdIconModule
  ],
})
export class MdNavigationModule {}
