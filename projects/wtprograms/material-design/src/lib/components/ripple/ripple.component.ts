import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { MdAttachableDirective } from '../../directives/attachable/attachable.directive';
import { MdComponent } from '../../common/base/md.component';
import { easingToFunction } from '../../common/motion';

enum State {
  INACTIVE,
  TOUCH_DELAY,
  HOLDING,
  WAITING_FOR_CLICK,
}

const TOUCH_DELAY_MS = 150;
const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const PRESS_PSEUDO = '::after';
const ANIMATION_FILL = 'forwards';

@Component({
  selector: 'md-ripple',
  templateUrl: './ripple.component.html',
  styleUrls: ['./ripple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
})
export class MdRippleComponent extends MdComponent {
  readonly hoverable = input(true);
  readonly interactive = input(true);
  readonly pressed = signal(false);

  private readonly _attachable = inject(MdAttachableDirective);
  private readonly _mdRoot = viewChild<ElementRef<HTMLElement>>('surface');

  private rippleSize = '';
  private rippleScale = '';
  private initialSize = 0;
  private growAnimation?: Animation;
  private state = State.INACTIVE;
  private rippleStartEvent?: PointerEvent;
  private checkBoundsAfterContextMenu = false;

  constructor() {
    super();
    this._attachable.targetEvent$.subscribe(this.handleEvent.bind(this));
  }

  private handlePointerleave() {
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
    if (!this.shouldReactToEvent(event)) {
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

  private handleClick(event: PointerEvent) {
    if (!this.interactive()) {
      return;
    }

    if (this.state === State.WAITING_FOR_CLICK) {
      this.endPressAnimation();
      return;
    }

    if (!this.isTouch(event) && this.state === State.INACTIVE) {
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
    if (!this.interactive()) {
      return;
    }

    this.checkBoundsAfterContextMenu = true;
    this.endPressAnimation();
  }

  private determineRippleSize() {
    const { height, width } = this.hostElement.getBoundingClientRect();
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
    const { left, top } = this.hostElement.getBoundingClientRect();
    const documentX = scrollX + left;
    const documentY = scrollY + top;
    const { pageX, pageY } = pointerEvent;
    return { x: pageX - documentX, y: pageY - documentY };
  }

  private getTranslationCoordinates(positionEvent?: Event) {
    const { height, width } = this.hostElement.getBoundingClientRect();
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
    const mdRoot = this._mdRoot()?.nativeElement;
    if (!mdRoot) {
      return;
    }

    this.pressed.set(true);
    this.growAnimation?.cancel();
    this.determineRippleSize();
    const { startPoint, endPoint } =
      this.getTranslationCoordinates(positionEvent);
    const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
    const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;

    this.growAnimation = mdRoot.animate(
      {
        top: [0, 0],
        left: [0, 0],
        height: [this.rippleSize, this.rippleSize],
        width: [this.rippleSize, this.rippleSize],
        transform: [
          `translate(${translateStart}) scale(1)`,
          `translate(${translateEnd}) scale(${this.rippleScale})`,
        ],
      },
      {
        pseudoElement: PRESS_PSEUDO,
        duration: PRESS_GROW_MS,
        easing: easingToFunction('standard'),
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
      this.pressed.set(false);
      return;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, MINIMUM_PRESS_MS - pressAnimationPlayState);
    });

    if (this.growAnimation !== animation) {
      return;
    }

    this.pressed.set(false);
  }

  private shouldReactToEvent(event: PointerEvent) {
    if (!this.interactive() || !event.isPrimary) {
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
    const { top, left, bottom, right } =
      this.hostElement.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  private isTouch({ pointerType }: PointerEvent) {
    return pointerType === 'touch';
  }

  private async handleEvent(event: Event) {
    switch (event.type) {
      case 'click':
        this.handleClick(event as PointerEvent);
        break;
      case 'contextmenu':
        this.handleContextmenu();
        break;
      case 'pointercancel':
        this.handlePointercancel(event as PointerEvent);
        break;
      case 'pointerdown':
        await this.handlePointerdown(event as PointerEvent);
        break;
      case 'pointerleave':
        this.handlePointerleave();
        break;
      case 'pointerup':
        this.handlePointerup(event as PointerEvent);
        break;
      default:
        break;
    }
  }
}
