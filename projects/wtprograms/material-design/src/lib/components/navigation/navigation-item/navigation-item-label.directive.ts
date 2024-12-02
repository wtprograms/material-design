import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[mdNavigationItemLabel]',
  standalone: true,
})
export class MdNavigationLabelDirective {}