import { customElement, property, query } from 'lit/decorators.js';
import { styles } from './styles';
import { html, LitElement, PropertyValues } from 'lit';
import { attribute, EASING, mixinAttachable } from '../../common';
import { filter, map, switchMap, tap } from 'rxjs';
import { isEvent } from '../../common/events/is-event';
import { tapIf } from '../../common/rxjs/operators/tap-if';
import { filterEvent } from '../../common/rxjs/operators/filter-event';

const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const PRESS_PSEUDO = '::after';
const ANIMATION_FILL = 'forwards';

/**
 * Interaction states for the ripple.
 *
 * On Touch:
 *  - `INACTIVE -> TOUCH_DELAY -> WAITING_FOR_CLICK -> INACTIVE`
 *  - `INACTIVE -> TOUCH_DELAY -> HOLDING -> WAITING_FOR_CLICK -> INACTIVE`
 *
 * On Mouse or Pen:
 *   - `INACTIVE -> WAITING_FOR_CLICK -> INACTIVE`
 */
enum State {
  /**
   * Initial state of the control, no touch in progress.
   *
   * Transitions:
   *   - on touch down: transition to `TOUCH_DELAY`.
   *   - on mouse down: transition to `WAITING_FOR_CLICK`.
   */
  INACTIVE,
  /**
   * Touch down has been received, waiting to determine if it's a swipe or
   * scroll.
   *
   * Transitions:
   *   - on touch up: begin press; transition to `WAITING_FOR_CLICK`.
   *   - on cancel: transition to `INACTIVE`.
   *   - after `TOUCH_DELAY_MS`: begin press; transition to `HOLDING`.
   */
  TOUCH_DELAY,
  /**
   * A touch has been deemed to be a press
   *
   * Transitions:
   *  - on up: transition to `WAITING_FOR_CLICK`.
   */
  HOLDING,
  /**
   * The user touch has finished, transition into rest state.
   *
   * Transitions:
   *   - on click end press; transition to `INACTIVE`.
   */
  WAITING_FOR_CLICK,
}

/**
 * Delay reacting to touch so that we do not show the ripple for a swipe or
 * scroll interaction.
 */
const TOUCH_DELAY_MS = 150;

const base = mixinAttachable(LitElement);

@customElement('md-ripple')
export class MdRippleElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  activated = false;

  @property({ type: Boolean })
  interactive = false;

  @property({ type: Boolean })
  hoverable = false;

  @query('.surface')
  private readonly _surface!: HTMLElement | null;

  private _growAnimation?: Animation;
  private _state = State.INACTIVE;
  private _rippleStartEvent?: PointerEvent;
  private _checkBoundsAfterContextMenu = false;

  constructor() {
    super();
    this.initialize(
      'click',
      'contextmenu',
      'pointercancel',
      'pointerdown',
      'pointerenter',
      'pointerleave',
      'pointerup'
    );
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.event$
      .pipe(
        filter(
          (x) =>
            isEvent<PointerEvent>(x, 'pointerenter') &&
            this.shouldReactToEvent(x) &&
            (this.hoverable || this.interactive)
        ),
        map(() => true),
        attribute(this, 'hovering')
      )
      .subscribe();
    this.event$
      .pipe(
        filter(
          (x) =>
            isEvent<PointerEvent>(x, 'pointerleave') &&
            this.shouldReactToEvent(x)
        ),
        map(() => false),
        attribute(this, 'hovering'),
        filter(() => this._state === State.INACTIVE),
        tap(() => this.endPressAnimation())
      )
      .subscribe();
    this.event$
      .pipe(
        filter(
          (x) =>
            isEvent<PointerEvent>(x, 'pointerup') && this.shouldReactToEvent(x)
        ),
        tapIf(
          () => this._state === State.HOLDING,
          () => (this._state = State.WAITING_FOR_CLICK)
        ),
        tapIf(
          () => this._state === State.TOUCH_DELAY,
          () => {
            this._state = State.WAITING_FOR_CLICK;
            this.startPressAnimation(this._rippleStartEvent);
          }
        )
      )
      .subscribe();
    this.event$
      .pipe(
        filterEvent<PointerEvent>('pointerdown'),
        filter((x) => this.shouldReactToEvent(x) && this.interactive),
        tap((x) => (this._rippleStartEvent = x)),
        filter((x) => {
          if (!this.isTouch(x)) {
            this._state = State.WAITING_FOR_CLICK;
            this.startPressAnimation(x);
            return false;
          }
          return true;
        }),
        filter((x) => !this._checkBoundsAfterContextMenu || this.inBounds(x)),
        switchMap(async (x) => {
          this._checkBoundsAfterContextMenu = false;
          this._state = State.TOUCH_DELAY;
          await new Promise((resolve) => {
            setTimeout(resolve, TOUCH_DELAY_MS);
          });
          return x;
        }),
        filter(() => this._state === State.TOUCH_DELAY),
        tap((x) => {
          this._state = State.HOLDING;
          this.startPressAnimation(x);
        })
      )
      .subscribe();
    this.event$
      .pipe(
        filterEvent('click'),
        filter(() => this.interactive),
        filter(() => {
          if (this._state === State.WAITING_FOR_CLICK) {
            this.endPressAnimation();
            return false;
          }
          return true;
        }),
        filter(() => {
          if (this._state === State.INACTIVE) {
            this.startPressAnimation();
            this.endPressAnimation();
            return false;
          }
          return true;
        })
      )
      .subscribe();
    this.event$
      .pipe(
        filterEvent('pointercancel'),
        tap(() => this.endPressAnimation())
      )
      .subscribe();
    this.event$
      .pipe(
        filterEvent('contextmenu'),
        tap(() => {
          this._checkBoundsAfterContextMenu = true;
          this.endPressAnimation();
        })
      )
      .subscribe();
  }

  protected override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('interactive') && !this.interactive) {
      this.activated = false;
    }
    super.updated(changedProperties);
  }

  protected override render(): unknown {
    return html`<div class="surface"></div>`;
  }

  private determineRippleSize() {
    const { height, width } = this.getBoundingClientRect();
    const maxDim = Math.max(height, width);
    const softEdgeSize = Math.max(
      SOFT_EDGE_CONTAINER_RATIO * maxDim,
      SOFT_EDGE_MINIMUM_SIZE
    );

    const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
    const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
    const maxRadius = hypotenuse + PADDING;

    const rippleScale = `${(maxRadius + softEdgeSize) / initialSize}`;
    const rippleSize = `${initialSize}px`;

    return {
      initialSize,
      rippleScale,
      rippleSize
    };
  }

  private getNormalizedPointerEventCoords(pointerEvent: PointerEvent): {
    x: number;
    y: number;
  } {
    const { scrollX, scrollY } = window;
    const { left, top } = this.getBoundingClientRect();
    const documentX = scrollX + left;
    const documentY = scrollY + top;
    const { pageX, pageY } = pointerEvent;
    return { x: pageX - documentX, y: pageY - documentY };
  }

  private getTranslationCoordinates(initialSize: number, positionEvent?: Event) {
    const { height, width } = this.getBoundingClientRect();
    // end in the center
    const endPoint = {
      x: (width - initialSize) / 2,
      y: (height - initialSize) / 2,
    };

    let startPoint;
    if (positionEvent instanceof PointerEvent) {
      startPoint = this.getNormalizedPointerEventCoords(positionEvent);
    } else {
      startPoint = {
        x: width / 2,
        y: height / 2,
      };
    }

    // center around start point
    startPoint = {
      x: startPoint.x - initialSize / 2,
      y: startPoint.y - initialSize / 2,
    };

    return { startPoint, endPoint };
  }

  private startPressAnimation(positionEvent?: Event) {
    if (!this._surface) {
      return;
    }

    this.activated = true;
    this._growAnimation?.cancel();
    const { initialSize, rippleSize, rippleScale } = this.determineRippleSize();
    const { startPoint, endPoint } =
      this.getTranslationCoordinates(initialSize,positionEvent);
    const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
    const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;

    this._growAnimation = this._surface.animate(
      {
        top: [0, 0],
        left: [0, 0],
        height: [rippleSize, rippleSize],
        width: [rippleSize, rippleSize],
        transform: [
          `translate(${translateStart}) scale(1)`,
          `translate(${translateEnd}) scale(${rippleScale})`,
        ],
      },
      {
        pseudoElement: PRESS_PSEUDO,
        duration: PRESS_GROW_MS,
        easing: EASING.standard.default,
        fill: ANIMATION_FILL,
      }
    );
  }

  private async endPressAnimation() {
    this._rippleStartEvent = undefined;
    this._state = State.INACTIVE;
    const animation = this._growAnimation;
    let pressAnimationPlayState = Infinity;
    if (typeof animation?.currentTime === 'number') {
      pressAnimationPlayState = animation.currentTime;
    } else if (animation?.currentTime) {
      pressAnimationPlayState = animation.currentTime.to('ms').value;
    }

    if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
      this.activated = false;
      return;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, MINIMUM_PRESS_MS - pressAnimationPlayState);
    });

    if (this._growAnimation !== animation) {
      // A new press animation was started. The old animation was canceled and
      // should not finish the pressed state.
      return;
    }

    this.activated = false;
  }

  /**
   * Returns `true` if
   *  - the ripple element is enabled
   *  - the pointer is primary for the input type
   *  - the pointer is the pointer that started the interaction, or will start
   * the interaction
   *  - the pointer is a touch, or the pointer state has the primary button
   * held, or the pointer is hovering
   */
  private shouldReactToEvent(event: PointerEvent) {
    if (!event.isPrimary) {
      return false;
    }

    if (
      this._rippleStartEvent &&
      this._rippleStartEvent.pointerId !== event.pointerId
    ) {
      return false;
    }

    if (event.type === 'pointerenter' || event.type === 'pointerleave') {
      return !this.isTouch(event);
    }

    const isPrimaryButton = event.buttons === 1;
    return this.isTouch(event) || isPrimaryButton;
  }

  /**
   * Check if the event is within the bounds of the element.
   *
   * This is only needed for the "stuck" contextmenu longpress on Chrome.
   */
  private inBounds({ x, y }: PointerEvent) {
    const { top, left, bottom, right } = this.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  private isTouch({ pointerType }: PointerEvent) {
    return pointerType === 'touch';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-ripple': MdRippleElement;
  }
}
