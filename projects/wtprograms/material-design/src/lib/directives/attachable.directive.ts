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
import { fromEvent, Subject, Subscription, tap } from 'rxjs';
import { MaterialDesignComponent } from '../components/material-design.component';

export type TargetType =
  | HTMLElement
  | ElementRef<HTMLElement>
  | undefined
  | MaterialDesignComponent;

@Directive({
  standalone: true,
})
export class AttachableDirective implements OnDestroy {
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

  private _subscription?: Subscription;

  constructor() {
    effect(() => {
      this._subscription?.unsubscribe();
      this._subscription = undefined;
      const targetElement = this.targetElement();
      if (!targetElement) {
        return;
      }
      for (const event of this.events()) {
        const observable = fromEvent(targetElement, event).pipe(
          tap((x) => this._event$.next(x))
        );
        if (!this._subscription) {
          this._subscription = observable.subscribe();
        } else {
          this._subscription.add(observable.subscribe());
        }
      }
    });
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
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
