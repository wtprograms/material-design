import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import style from './index.scss';
import { EASING, mixinAttachable } from '../../common';

const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const PRESS_PSEUDO = '::after';
const ANIMATION_FILL = 'forwards';

enum State {
  INACTIVE,
  TOUCH_DELAY,
  HOLDING,
  WAITING_FOR_CLICK,
}

const TOUCH_DELAY_MS = 150;

const base = mixinAttachable(LitElement);

@customElement('md-ripple')
export class MdRippleElement extends base {
  static override styles = [style];

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  hoverable = false;

  @property({ type: Boolean, reflect: true })
  activatable = false;

  @state()
  private hovered = false;

  @state()
  private activated = false;

  @query('.surface')
  private readonly mdRoot!: HTMLElement | null;

  private rippleSize = '';
  private rippleScale = '';
  private initialSize = 0;
  private growAnimation?: Animation;
  private state = State.INACTIVE;
  private rippleStartEvent?: PointerEvent;
  private checkBoundsAfterContextMenu = false;

  constructor() {
    super();
    this.initialize(
      'click',
      'contextmenu',
      'pointerdown',
      'pointerenter',
      'pointerleave',
      'pointerup',
      'pointercancel'
    );
  }

  protected override render() {
    const classes = {
      hovered: this.hovered,
      activated: this.activated,
    };

    return html`<div class="surface ${classMap(classes)}"></div>`;
  }

  protected override update(changedProps: PropertyValues<MdRippleElement>) {
    if (changedProps.has('disabled') && this.disabled) {
      this.hovered = false;
      this.activated = false;
    }
    super.update(changedProps);
  }

  handlePointerenter(event: PointerEvent) {
    if (!this.shouldReactToEvent(event) || !this.hoverable) {
      return;
    }

    this.hovered = true;
  }

  handlePointerleave(event: PointerEvent) {
    if (!this.shouldReactToEvent(event)) {
      return;
    }

    this.hovered = false;

    if (this.state !== State.INACTIVE) {
      this.endPressAnimation();
    }
  }

  private handlePointerup(event: PointerEvent) {
    if (!this.shouldReactToEvent(event)) {
      return;
    }

    if (this.state === State.HOLDING) {
      this.state = State.WAITING_FOR_CLICK;
      return;
    }

    if (this.state === State.TOUCH_DELAY) {
      this.state = State.WAITING_FOR_CLICK;
      this.startPressAnimation(this.rippleStartEvent);
      return;
    }
  }

  private async handlePointerdown(event: PointerEvent) {
    if (!this.shouldReactToEvent(event) || !this.activatable) {
      return;
    }

    this.rippleStartEvent = event;
    if (!this.isTouch(event)) {
      this.state = State.WAITING_FOR_CLICK;
      this.startPressAnimation(event);
      return;
    }

    if (this.checkBoundsAfterContextMenu && !this.inBounds(event)) {
      return;
    }

    this.checkBoundsAfterContextMenu = false;

    this.state = State.TOUCH_DELAY;
    await new Promise((resolve) => {
      setTimeout(resolve, TOUCH_DELAY_MS);
    });

    if (this.state !== State.TOUCH_DELAY) {
      return;
    }

    this.state = State.HOLDING;
    this.startPressAnimation(event);
  }

  private handleClick() {
    if (this.disabled || !this.activatable) {
      return;
    }

    if (this.state === State.WAITING_FOR_CLICK) {
      this.endPressAnimation();
      return;
    }

    if (this.state === State.INACTIVE) {
      this.startPressAnimation();
      this.endPressAnimation();
    }
  }

  private handlePointercancel(event: PointerEvent) {
    if (!this.shouldReactToEvent(event)) {
      return;
    }

    this.endPressAnimation();
  }

  private handleContextmenu() {
    if (this.disabled) {
      return;
    }

    this.checkBoundsAfterContextMenu = true;
    this.endPressAnimation();
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

    this.initialSize = initialSize;
    this.rippleScale = `${(maxRadius + softEdgeSize) / initialSize}`;
    this.rippleSize = `${initialSize}px`;
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

  private getTranslationCoordinates(positionEvent?: Event) {
    const { height, width } = this.getBoundingClientRect();
    const endPoint = {
      x: (width - this.initialSize) / 2,
      y: (height - this.initialSize) / 2,
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

    startPoint = {
      x: startPoint.x - this.initialSize / 2,
      y: startPoint.y - this.initialSize / 2,
    };

    return { startPoint, endPoint };
  }

  private startPressAnimation(positionEvent?: Event) {
    if (!this.mdRoot) {
      return;
    }

    this.activated = true;
    this.growAnimation?.cancel();
    this.determineRippleSize();
    const { startPoint, endPoint } =
      this.getTranslationCoordinates(positionEvent);
    const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
    const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;
    const scale = this.rippleScale === 'Infinity' ? 0 : this.rippleScale;
    this.growAnimation = this.mdRoot.animate(
      {
        top: [0, 0],
        left: [0, 0],
        height: [this.rippleSize, this.rippleSize],
        width: [this.rippleSize, this.rippleSize],
        transform: [
          `translate(${translateStart}) scale(1)`,
          `translate(${translateEnd}) scale(${scale})`,
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
    this.rippleStartEvent = undefined;
    this.state = State.INACTIVE;
    const animation = this.growAnimation;
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

    if (this.growAnimation !== animation) {
      return;
    }

    this.activated = false;
  }

  private shouldReactToEvent(event: PointerEvent) {
    if (this.disabled || !event.isPrimary) {
      return false;
    }

    if (
      this.rippleStartEvent &&
      this.rippleStartEvent.pointerId !== event.pointerId
    ) {
      return false;
    }

    if (event.type === 'pointerenter' || event.type === 'pointerleave') {
      return !this.isTouch(event);
    }

    const isPrimaryButton = event.buttons === 1;
    return this.isTouch(event) || isPrimaryButton;
  }

  private inBounds({ x, y }: PointerEvent) {
    const { top, left, bottom, right } = this.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  private isTouch({ pointerType }: PointerEvent) {
    return pointerType === 'touch';
  }

  override async handleControlEvent(event: Event) {
    const handlers: Record<string, () => Promise<void>> = {
      click: async () => this.handleClick(),
      contextmenu: async () => this.handleContextmenu(),
      pointercancel: async () =>
        this.handlePointercancel(event as PointerEvent),
      pointerdown: async () =>
        await this.handlePointerdown(event as PointerEvent),
      pointerenter: async () => this.handlePointerenter(event as PointerEvent),
      pointerleave: async () => this.handlePointerleave(event as PointerEvent),
      pointerup: async () => this.handlePointerup(event as PointerEvent),
    };
    await handlers[event.type]();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-ripple': MdRippleElement;
  }
}
// 0821952 option 2
