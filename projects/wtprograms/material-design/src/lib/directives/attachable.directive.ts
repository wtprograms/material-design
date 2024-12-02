import { DOCUMENT } from '@angular/common';
import {
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  isSignal,
} from '@angular/core';
import { MdComponent } from '../components/md.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, merge, switchMap } from 'rxjs';

const EVENTS = [
  'click',
  'pointerenter',
  'pointerleave',
  'pointerdown',
  'pointerup',
  'pointercancel',
  'contextmenu',
  'focusin',
  'focusout',
];

@Directive()
export class MdAttachableDirective {
  readonly target = input<unknown>();
  readonly targetElement = computed(() => this.getTarget(this.target()));

  private readonly _destroyRef = inject(DestroyRef);

  readonly targetEvent$ = toObservable(this.targetElement).pipe(
    switchMap((target) =>
      merge(...EVENTS.map((event) => fromEvent(target, event)))
    ),
    takeUntilDestroyed(this._destroyRef),
  );

  private readonly _hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly _document = inject(DOCUMENT);

  private getTarget(target: unknown): HTMLElement {
    if (isSignal(target)) {
      return this.getTarget(target());
    }
    if (target instanceof HTMLElement) {
      return target;
    }
    if (target instanceof ElementRef) {
      return target.nativeElement as HTMLElement;
    }
    if (target instanceof MdComponent) {
      return target.hostElement as HTMLElement;
    }
    if (typeof target === 'string') {
      return this._document.querySelector(target) as HTMLElement;
    }
    return this._hostElement.parentElement as HTMLElement;
  }
}
