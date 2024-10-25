import { Directive, HostListener } from '@angular/core';
import { AttachableDirective } from './attachable.directive';

@Directive({
  standalone: true,
})
export class ForwardFocusDirective extends AttachableDirective {
  @HostListener('focus')
  onFocus() {
    this.targetElement()?.focus();
  }

  @HostListener('blur')
  onBlur() {
    this.targetElement()?.blur();
  }
}
