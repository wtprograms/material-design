import { NgModule } from '@angular/core';
import { MdAccordionComponent } from './accordion.component';
import { mdAccordionHeadlineDirective } from './accordion-headline.directive';

@NgModule({
  imports: [MdAccordionComponent, mdAccordionHeadlineDirective],
  exports: [MdAccordionComponent, mdAccordionHeadlineDirective],
})
export class MdAccordionModule {}