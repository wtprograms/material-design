import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  isSignal,
  model,
  OnDestroy,
  Signal,
  Type,
} from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import {
  combineLatest,
  filter,
  fromEvent,
  merge,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { MaterialDesignComponent } from '../components/material-design.component';

export type TargetType =
  | HTMLElement
  | ElementRef<HTMLElement>
  | undefined
  | MaterialDesignComponent;

@Directive({
  standalone: true,
})
export class AttachableDirective {
  readonly events = model<string[]>([]);
  readonly target = model<TargetType>();
  readonly for = model<string>();

  readonly hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private readonly _forElement = computed(() => {
    const htmlFor = this.for();
    if (!htmlFor) {
      return undefined;
    }
    return (
      this.hostElement.getRootNode() as Document | ShadowRoot
    ).querySelector<HTMLElement>(`#${htmlFor}`);
  });

  readonly targetElement = computed(
    () => this._forElement() ?? getElement(this.target())
  );
  readonly targetElement$ = toObservable(this.targetElement);

  get event$() {
    return this._event$.asObservable();
  }
  private readonly _event$ = new Subject<Event>();
  readonly event = outputFromObservable(this._event$);

  constructor() {
    combineLatest({
      target: this.targetElement$,
      events: toObservable(this.events),
    })
      .pipe(
        filter(({ target }) => !!target),
        switchMap(({ target, events }) =>
          merge(...events.map((x) => fromEvent(target!, x)))
        ),
        tap((x) => this._event$.next(x))
      )
      .subscribe();
  }
}

function getElement(element: TargetType) {
  if (!element) {
    return undefined;
  }
  if (element instanceof MaterialDesignComponent) {
    return element.hostElement;
  }
  return element instanceof ElementRef ? element.nativeElement : element;
}

export function attachTarget<T extends AttachableDirective>(
  type: Type<T>,
  element: TargetType | Signal<TargetType>
) {
  const directive = inject(type);
  if (isSignal(element)) {
    effect(() => directive.target.set(getElement(element())), {
      allowSignalWrites: true,
    });
  } else {
    directive.target.set(getElement(element));
  }
  return directive;
}

export function attach(...events: string[]) {
  const directive = inject(AttachableDirective);
  directive.events.set(events);
  return directive;
}
