import { Directive, HostListener } from '@angular/core';
import { isActivationClick } from '../common/events/is-activation-click';
import { dispatchActivationClick } from '../common/events/dispatch-activation-click';
import { AttachableDirective } from './attachable.directive';

@Directive({
  standalone: true,
})
export class ParentActivationDirective extends AttachableDirective {
  @HostListener('click', ['$event'])
  click(event: MouseEvent) {
    const target = this.targetElement();
    if (!target) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (!isActivationClick(event)) {
      return;
    }
    this.hostElement.focus();
    event.preventDefault();
    event.stopImmediatePropagation();
    dispatchActivationClick(target);
  }
}
