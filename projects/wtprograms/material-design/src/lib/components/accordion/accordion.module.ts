import { NgModule } from '@angular/core';
import { MdAccordionComponent } from './accordion.component';
import { MdAccordionHeadlineComponent } from './accordion-headline/accordion-headline.component';

@NgModule({
  imports: [MdAccordionComponent, MdAccordionHeadlineComponent],
  exports: [MdAccordionComponent, MdAccordionHeadlineComponent],
})
export class MdAccordionModule {}
