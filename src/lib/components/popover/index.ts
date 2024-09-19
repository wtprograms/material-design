import { html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styles } from './styles';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  Placement,
  shift,
  Strategy,
} from '@floating-ui/dom';
import {
  cssProperty,
  EASING,
  filterAnyEvent,
  filterEvent,
  mixinAttachable,
  observe,
} from '../../common';
import {
  filter,
  fromEvent,
  map,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { animateElement } from '../../common/rxjs/operators/animate-element';
import { mixinOpenClose } from '../../common/mixins/mixin-open-close';

export type PopoverTrigger = 'click' | 'hover' | 'contextmenu' | 'manual';

const base = mixinAttachable(mixinOpenClose(LitElement));

interface Position {
  top?: string;
  'inset-inline-start'?: string;
  placement?: Placement;
}

@customElement('md-popover')
export class MdPopoverElement extends base {
  static override styles = [styles];

  @property({ type: String, attribute: 'triggers' })
  triggersString: string = 'click';

  get triggers(): PopoverTrigger[] {
    return this.triggersString.split(' ') as PopoverTrigger[];
  }

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

  @property({ type: Boolean, attribute: 'no-elevation' })
  noElevation = false;

  @property({ type: Boolean, attribute: 'close-on-event' })
  closeOnEvent = false;

  @property({ type: Boolean, attribute: 'stop-close-propegation' })
  stopClosePropegation = false;

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
      animateElement(
        () => this.animateContainer(true),
        () => this.animateBody(true)
      )
    );
  }

  override get closeComponent$(): Observable<unknown> {
    return of({}).pipe(
      animateElement(
        () => this.animateContainer(false),
        () => this.animateBody(false)
      ),
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

  @query('.container')
  private _container!: HTMLElement;

  @query('.body')
  private _body!: HTMLElement;

  private readonly _position$ = new Subject<Position>();
  private readonly _opacity$ = new Subject<'1' | ''>();
  private readonly _display$ = new Subject<'inline-flex' | ''>();
  private readonly _transformOrigin$ = this._position$.pipe(
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
        filter(
          () =>
            this.triggers.includes('click') &&
            !this.triggers.includes('manual') &&
            !this.customEvent
        ),
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
        filter(
          () =>
            this.triggers.includes('hover') &&
            !this.triggers.includes('manual') &&
            !this.customEvent
        ),
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
        filter(() => this.triggers.includes('hover')),
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
        filter(
          () =>
            this.triggers.includes('contextmenu') &&
            !this.triggers.includes('manual') &&
            !this.customEvent
        ),
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

  override render() {
    const elevation = this.noElevation
      ? nothing
      : html`<md-elevation level="2"></md-elevation>`;
    return html`<div
        part="container"
        class="container"
        style="transformOrigin: ${observe(this._transformOrigin$)}"
      >
        ${elevation}
      </div>
      <div part="body" class="body">
        <slot @close-popover=${this.handleClosePopover}></slot>
      </div>`;
  }

  private handleClosePopover(event: Event) {
    if (this.stopClosePropegation) {
      event.stopPropagation();
    }
    this.closeComponent();
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

  private animateBody(opening: boolean) {
    let opacity = ['0', '1'];
    let delay = 200;
    if (!opening) {
      delay = 0;
      opacity = opacity.reverse();
    }

    const easing = opening
      ? EASING.standard.decelerate
      : EASING.standard.accelerate;
    const duration = opening ? 300 : 50;

    return this._body.animate(
      {
        opacity,
      },
      {
        delay,
        easing,
        duration,
        fill: 'forwards',
      }
    );
  }

  private animateContainer(opening: boolean) {
    let transform = ['scaleY(30%)', 'scaleY(100%)'];
    let delay = 0;
    let opacity = ['0', '1'];
    if (!opening) {
      delay = 50;
      transform = transform.reverse();
      opacity = opacity.reverse();
    }

    const easing = opening
      ? EASING.standard.decelerate
      : EASING.standard.accelerate;
    const duration = opening ? 300 : 150;

    return this._container.animate(
      {
        transform,
        opacity,
      },
      {
        delay,
        easing,
        duration,
        fill: 'forwards',
      }
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-popover': MdPopoverElement;
  }
}
