import { Directive } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { observeResize$ } from '../common/rxjs/observe-resize';
import { MdDirective } from '../common/base/md.directive';

@Directive({
  selector: '[mdResize]',
})
export class MdResizeDirective extends MdDirective {
  readonly mdResize = outputFromObservable<DOMRect | undefined>(
    observeResize$(this.hostElement, this.platformId)
  );
}
