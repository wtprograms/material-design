import { Directive } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MdDirective } from '../common/base/md.directive';
import { observeResize$ } from '../common/rxjs/observe-resize';

@Directive({
  selector: '[mdResized]',
})
export class MdResizedDirective extends MdDirective {
  readonly mdResized = outputFromObservable<DOMRect | undefined>(
    observeResize$(this.hostElement, this.platformId)
  );
}
