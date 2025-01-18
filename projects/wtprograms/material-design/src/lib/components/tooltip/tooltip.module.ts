import { NgModule } from '@angular/core';
import { MdTooltipComponent } from './tooltip.component';
import { MdTooltipHeadlineComponent } from './tooltip-headline/tooltip-headline.component';

@NgModule({
  imports: [MdTooltipComponent, MdTooltipHeadlineComponent],
  exports: [MdTooltipComponent, MdTooltipHeadlineComponent],
})
export class MdTooltipModule {}
