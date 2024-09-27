import { MixinBase, MixinReturn } from './mixin';
import { ObservableElement } from '../lit/observable-element';
import { Attachable, mixinAttachable } from './mixin-attachable';
import { mixinOpenClose, OpenCloseElement } from './mixin-open-close';
import { autoUpdate, computePosition, flip, offset, Placement, shift, Strategy } from '@floating-ui/dom';
import { property } from 'lit/decorators.js';
import { PropertyValues } from 'lit';
import { Observable, of, tap, Subject, map, Subscription, filter, switchMap, timer, takeUntil, fromEvent } from 'rxjs';
import { animateElement } from '../rxjs/operators/animate-element';
import { cssProperty } from '../rxjs/operators/css-property';
import { filterAnyEvent } from '../rxjs/operators/filter-any-event';
import { filterEvent } from '../rxjs/operators/filter-event';

export type PopoverTrigger = 'click' | 'hover' | 'contextmenu' | 'manual';

export interface PopoverElement extends Attachable, OpenCloseElement {
  trigger: PopoverTrigger;
  customEvent: string | null;
  placement: Placement;
  strategy: Strategy;
  native: boolean;
  offset: number;
  shift: boolean;
  flip: boolean;
  manualClose: boolean;
  delay: number;
  closeOnEvent: boolean;
  transformOrigin$: Observable<string>;
  getPopoverAnimations(opening: boolean): Generator<() => Animation>;
}

interface Position {
  top?: string;
  'inset-inline-start'?: string;
  placement?: Placement;
}

export function mixinPopover<T extends MixinBase<ObservableElement>>(
  base: T
): MixinReturn<T, PopoverElement> {1
  const _base = mixinAttachable(mixinOpenClose(base));

  abstract class Mixin extends _base implements PopoverElement {
    @property({ type: String })
    trigger: PopoverTrigger = 'click';
  
    @property({ type: String, attribute: 'custom-event' })
    customEvent: string | null = null;
  
    @property({ type: String })
    placement: Placement = 'bottom-start';
  
    @property({ type: String, reflect: true })
    strategy: Strategy = 'absolute';
  
    @property({ type: Boolean, reflect: true })
    native = false;
  
    @property({ type: Number })
    offset = 0;
  
    @property({ type: Boolean })
    shift = false;
  
    @property({ type: Boolean })
    flip = false;
  
    @property({ type: Boolean, attribute: 'manual-close' })
    manualClose = false;
  
    @property({ type: Boolean, attribute: 'close-on-event' })
    closeOnEvent = false;
  
    @property({ type: Number, attribute: 'delay' })
    delay = 0;

    override get openComponent$(): Observable<unknown> {
      return of({}).pipe(
        tap(() => {
          if (this.control) {
            this._cleanUpPositioningEvents = autoUpdate(
              this.control!,
              this,
              this.updatePosition.bind(this)
            );
          }
          this._display$.next('inline-flex');
          if (this.native) {
            this.showPopover();
          }
          this._opacity$.next('1');
        }),
        animateElement(...this.getPopoverAnimations(true)),
      );
    }
  
    override get closeComponent$(): Observable<unknown> {
      return of({}).pipe(
        animateElement(...this.getPopoverAnimations(false)),
        tap(() => {
          this._cleanUpPositioningEvents?.();
          this._opacity$.next('');
          this._display$.next('');
          if (this.native) {
            this.hidePopover();
          }
        })
      );
    }

    private readonly _position$ = new Subject<Position>();
    private readonly _opacity$ = new Subject<'1' | ''>();
    private readonly _display$ = new Subject<'inline-flex' | ''>();
    readonly transformOrigin$ = this._position$.pipe(
      map((x) => x.placement ?? this.placement),
      map((placement) => {
        const top: Placement[] = [
          'right-start',
          'left-start',
          'bottom',
          'bottom-start',
          'bottom-end',
        ];
        const bottom: Placement[] = [
          'right-end',
          'left-end',
          'top',
          'top-start',
          'top-end',
        ];
        if (top.find((x) => x === placement)) {
          return 'top';
        } else if (bottom.find((x) => x === placement)) {
          return 'bottom';
        }
        return '';
      })
    );
  
    private _cleanUpPositioningEvents?: () => void;
    private readonly _cancelOpen$ = new Subject<void>();
    private _documentClickSubscription?: Subscription;

    protected override firstUpdated(_changedProperties: PropertyValues): void {
      super.firstUpdated(_changedProperties);
      const events = [
        'click',
        'pointerdown',
        'pointerenter',
        'pointerleave',
        'contextmenu',
      ];
      if (this.customEvent) {
        events.push(this.customEvent);
      }
      this.initialize(...events);
    }

    override connectedCallback(): void {
      super.connectedCallback();
      if (this.native) {
        this.popover = 'manual';
      }
      this._opacity$.pipe(cssProperty(this, 'opacity')).subscribe();
      this._display$.pipe(cssProperty(this, 'display')).subscribe();
      this.event$
        .pipe(
          filter(() => this.trigger === 'click' && !this.customEvent),
          filterEvent('click'),
          tap(() => {
            if (this.closeOnEvent && this.open) {
              this.closeComponent();
            } else {
              this.openComponent();
            }
          })
        )
        .subscribe();
      this.event$
        .pipe(
          filter(() => this.trigger === 'hover' && !this.customEvent),
          filterEvent('pointerenter'),
          switchMap(() =>
            timer(this.delay).pipe(
              takeUntil(this._cancelOpen$),
              tap(() => this.openComponent())
            )
          )
        )
        .subscribe();
      this.event$
        .pipe(
          filter(() => this.trigger === 'hover'),
          filterEvent('pointerleave'),
          tap(() => {
            this._cancelOpen$.next();
            if (!this.manualClose) {
              this.closeComponent();
            }
          })
        )
        .subscribe();
      this.event$
        .pipe(
          filter(() => this.trigger === 'contextmenu' && !this.customEvent),
          filterEvent('contextmenu'),
          tap((x) => {
            x.preventDefault();
            this.openComponent();
          })
        )
        .subscribe();
      this._position$
        .pipe(
          tap((position) => {
            this.style.top = position.top ?? '';
            this.style.insetInlineStart = position['inset-inline-start'] ?? '';
          })
        )
        .subscribe();
      this._documentClickSubscription = fromEvent(document, 'click')
        .pipe(
          filter(() => !this.manualClose),
          tap((event) => {
            if (!this.open) {
              return;
            }
            const path = event.composedPath();
            if (path.includes(this) || path.includes(this.control!)) {
              return;
            }
            this.closeComponent();
          })
        )
        .subscribe();
      if (this.customEvent) {
        this.event$
          .pipe(
            filterAnyEvent(this.customEvent),
            tap(() => {
              if (this.closeOnEvent && this.open) {
                this.closeComponent();
              } else {
                this.openComponent();
              }
            })
          )
          .subscribe();
      }
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this._documentClickSubscription?.unsubscribe();
      this._cleanUpPositioningEvents?.();
    }

    private async updatePosition() {
      if (!this.control) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const middleware: any[] = [offset(this.offset)];
      if (this.flip) {
        middleware.push(flip());
      }
      if (this.shift) {
        middleware.push(shift());
      }
      const result = await computePosition(this.control!, this, {
        middleware,
        placement: this.placement,
        strategy: this.strategy,
      });
      this._position$.next({
        'inset-inline-start': `${result.x}px`,
        top: `${result.y}px`,
        placement: result.placement,
      });
      return result;
    }

    *getPopoverAnimations(opening: boolean): Generator<() => Animation> {}
  }

  return Mixin;
}
