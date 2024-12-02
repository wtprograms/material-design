import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[mdAccordionHeadline]',
})
export class mdAccordionHeadlineDirective {
  readonly hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
}
