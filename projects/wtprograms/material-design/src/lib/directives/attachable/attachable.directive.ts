import {
  computed,
  Directive,
  effect,
  input,
  isSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge, Subject, Subscription, tap } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { TargetType } from './target-type';
import { getTargetElement } from './get-target-element';
import { MdDirective } from '../../common/base/md.directive';

const EVENTS = [
  'click',
  'pointerenter',
  'pointerleave',
  'pointerdown',
  'pointerup',
  'pointercancel',
  'focusin',
  'focusout',
];

@Directive()
export class MdAttachableDirective extends MdDirective {
  readonly target = input<TargetType>();

  readonly targetElement = computed(() => {
    let target = this.target();
    if (isSignal(target)) {
      target = target();
    }
    return getTargetElement(this.document, this.hostElement, target);
  });

  readonly targetEvent$ = new Subject<Event>();

  constructor() {
    super();
    let subscription: Subscription | undefined;
    effect(() => {
      subscription?.unsubscribe();
      const targetElement = this.targetElement();
      if (!targetElement) {
        console.warn('Target element is not found and is set to null.');
        return;
      }
      if (isPlatformServer(this.platformId)) {
        return;
      }
      subscription = merge(
        ...EVENTS.map((event) => fromEvent(targetElement, event))
      )
        .pipe(
          tap((event) => this.targetEvent$.next(event)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    });
  }
}


