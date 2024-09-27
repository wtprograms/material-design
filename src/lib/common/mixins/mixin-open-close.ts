import { PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { attribute } from '../rxjs/operators/attribute';
import { ObservableElement } from '../lit/observable-element';

export interface OpenCloseElement {
  open: boolean;
  open$: Observable<boolean>;
  opening$: Observable<boolean>;
  closing$: Observable<boolean>;
  openOnFirstUpdate: boolean;
  get openComponent$(): Observable<unknown>
  get closeComponent$(): Observable<unknown>
  openComponent(): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closeComponent(...args: any[]): void;
}

export function mixinOpenClose<T extends MixinBase<ObservableElement>>(
  base: T
): MixinReturn<T, OpenCloseElement> {
  abstract class Mixin extends base implements OpenCloseElement {
    @property({ type: Boolean, attribute: 'open-on-first-update'})
    openOnFirstUpdate = false;
    
    get open() {
      return this._open$.value;
    }
    set open(value: boolean) {
      if (value) {
        this.openComponent();
      } else {
        this.closeComponent();
      }
    }

    get open$(): Observable<boolean> {
      return this._open$.asObservable();
    }
    get opening$(): Observable<boolean> {
      return this._opening$.asObservable();
    }
    get closing$(): Observable<boolean> {
      return this._closing$.asObservable();
    }

    get openComponent$(): Observable<unknown> {
      return of({}).pipe(map(() => {}));
    }

    get closeComponent$(): Observable<unknown> {
      return of({}).pipe(map(() => {}));
    }
    private readonly _open$ = new BehaviorSubject<boolean>(false);
    private readonly _opening$ = new Subject<boolean>();
    private readonly _closing$ = new Subject<boolean>();

    override connectedCallback() {
      super.connectedCallback();
      this._opening$
        .pipe(
          tap(() => this.dispatchEvent(new Event('opening', { bubbles: true })))
        )
        .subscribe();
      this._closing$
        .pipe(
          tap(() => this.dispatchEvent(new Event('closing', { bubbles: true })))
        )
        .subscribe();
      this._open$
        .pipe(
          attribute(this, 'open'),
          distinctUntilChanged(),
          tap((x) => {
            if (x) {
              this.dispatchEvent(new Event('open', { bubbles: true }));
            } else {
              this.dispatchEvent(new Event('close', { bubbles: true }));
            }
          })
        )
        .subscribe();

      this._opening$
        .pipe(
          filter(() => !this.open),
          attribute(this, 'opening'),
          switchMap(() => this.openComponent$),
          map(() => false),
          attribute(this, 'opening'),
          tap(() => this._open$.next(true))
        )
        .subscribe();
      this._closing$
        .pipe(
          filter(() => this.open),
          attribute(this, 'closing'),
          switchMap(() => this.closeComponent$),
          map(() => false),
          attribute(this, 'closing'),
          tap(() => this._open$.next(false))
        )
        .subscribe();
    }

    protected override firstUpdated(_changedProperties: PropertyValues): void {
      super.firstUpdated(_changedProperties);
      if (this.openOnFirstUpdate) {
        this.openComponent();
      }
    }

    openComponent() {
      this._opening$.next(true);
    }

    closeComponent(...args: any[]) {
      this._closing$.next(true);
    }
  }
  return Mixin;
}
