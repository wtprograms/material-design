import { Directive } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MdDirective } from '../common/base/md.directive';
import { observeIntersection$ } from '../common/rxjs/observe-intersection';
import { map } from 'rxjs';

@Directive({
  selector: '[mdIntersected]',
})
export class MdIntersectingDirective extends MdDirective {
  readonly mdIntersected = outputFromObservable(
    observeIntersection$(this.hostElement, this.platformId).pipe(
      map(x => x[0].isIntersecting)
    )
  );
}
