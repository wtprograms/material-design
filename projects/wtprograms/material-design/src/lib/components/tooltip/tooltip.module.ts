import { NgModule } from '@angular/core';
import { MdTooltipComponent } from './tooltip.component';
import { MdTooltipHeadlineDirective } from './tooltip-headline.directive';
import { MdTooltipActionDirective } from './tooltip-action.directive';

@NgModule({
  imports: [
    MdTooltipHeadlineDirective,
    MdTooltipActionDirective,
    MdTooltipComponent,
  ],
  exports: [
    MdTooltipHeadlineDirective,
    MdTooltipActionDirective,
    MdTooltipComponent,
  ],
})
export class MdTooltipModule {}
