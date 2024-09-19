import { html, LitElement, nothing, PropertyValues } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { MdPopoverElement } from '../popover';
import {
  delay,
  filter,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import {
  animateElement,
  cssProperty,
  EASING,
  mixinOpenClose,
  property$,
} from '../../common';
import { offset, flip, shift, computePosition } from '@floating-ui/dom';

const base = mixinOpenClose(LitElement);

@customElement('md-snack-bar')
export class MdSnackBarElement extends base {
  static override styles = [styles];

  @queryAssignedElements({ slot: 'action', flatten: true })
  private _actionElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true })
  actions = false;

  @property({ type: Boolean, reflect: true })
  multiline = false;

  @property({ type: Number })
  timeout = 5000;

  @property({ type: Number, attribute: 'offset-top' })
  @property$()
  offsetBottom = 24;
  offsetBottom$!: Observable<number>;

  @query('.container')
  private _container!: HTMLElement;

  @query('.body')
  private _body!: HTMLElement;

  @query('.popover')
  private _popover!: HTMLElement;

  override get openComponent$(): Observable<unknown> {
    return of({}).pipe(
      tap(() => {
        this._display$.next('contents');
        this._popover.showPopover();
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
        this._opacity$.next('');
        this._display$.next('');
        this._popover.hidePopover();
        return false;
      })
    );
  }

  private _dismiss$ = new Subject<void>();
  private readonly _opacity$ = new Subject<'1' | ''>();
  private readonly _display$ = new Subject<'contents' | ''>();

  override connectedCallback(): void {
    super.connectedCallback();
    this._opacity$.pipe(cssProperty(this, 'opacity')).subscribe();
    this._display$.pipe(cssProperty(this, 'display')).subscribe();
    this.open$
      .pipe(
        filter((x) => x),
        switchMap(() =>
          timer(this.timeout).pipe(
            takeUntil(this._dismiss$),
            tap(() => this.closeComponent())
          )
        )
      )
      .subscribe();
    this.open$
      .pipe(
        filter((x) => !x),
        tap(() => this._dismiss$.next())
      )
      .subscribe();
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    this.offsetBottom$
      .pipe(
        map((offset) => `${offset}px`),
        cssProperty(this, 'margin-bottom')
      )
      .subscribe();
  }

  override render() {
    return html`<div class="popover" popover="manual">
      <div class="container">
        <md-elevation level="2"></md-elevation>
      </div>
      <div class="body">
        <slot></slot>
        <div class="actions">
          <slot
            name="action"
            @slotchange=${() => (this.actions = !!this._actionElements.length)}
            @click=${() => this.closeComponent()}
          ></slot>
        </div>
      </div>
    </div>`;
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
    'md-snack-bar': MdSnackBarElement;
  }
}
