import { Directive } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MdDirective } from '../common/base/md.directive';
import { observeMutation$ } from '../common/rxjs/observe-mutation';

@Directive({
  selector: '[mdMutated]',
})
export class MdMutatedDirective extends MdDirective {
  readonly mdMutated = outputFromObservable(
    observeMutation$(this.hostElement, this.platformId)
  );
}
