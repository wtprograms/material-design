import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { AttachableDirective } from '../../directives/attachable.directive';
import { toSignal } from '@angular/core/rxjs-interop';
import { delay, filter, map, tap } from 'rxjs';
import { EASING } from '../../common/motion/easing';

type ActivationState =
  | 'inactive'
  | 'touch-delay'
  | 'holding'
  | 'waiting-for-click';

@Component({
  selector: 'md-ripple, [mdRipple]',
  templateUrl: './ripple.component.html',
  styleUrl: './ripple.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: true,
  hostDirectives: [
    {
      directive: AttachableDirective,
      inputs: ['events', 'for', 'target'],
    },
  ],
  host: {
    '[attr.hovering]': 'hovering() || null',
    '[attr.activated]': 'activated() || null',
  },
})
export class RippleComponent extends MaterialDesignComponent {
  readonly hoverable = model(true);
  readonly interactive = model(true);
  readonly attachableDirective = inject(AttachableDirective);
  readonly hovering = toSignal(
    this.attachableDirective.event$.pipe(
      filter(
        (x): x is PointerEvent =>
          (this.hoverable() || this.interactive()) &&
          (x.type === 'pointerenter' || x.type === 'pointerleave')
      ),
      filter((x) => this.shouldReactToEvent(x)),
      tap((x) => x.type === 'pointerleave' && this.endPressAnimation()),
      map((x) => x.type === 'pointerenter')
    )
  );
  readonly activated = signal(false);

  private _rippleStartEvent?: PointerEvent;
  private _checkBoundsAfterContextMenu = false;
  private _growAnimation?: Animation;

  private _state: ActivationState = 'inactive';

  private readonly _pointerUp$ = this.attachableDirective.event$.pipe(
    filter((x): x is PointerEvent => x.type === 'pointerup'),
    filter((x) => this.shouldReactToEvent(x)),
    map(() => {
      if (this._state === 'holding') {
        return 'waiting-for-click';
      }
      if (this._state === 'touch-delay') {
        this.startPressAnimation(this._rippleStartEvent);
        return 'waiting-for-click';
      }
      return undefined;
    }),
    filter((x) => !!x),
    tap((x) => (this._state = x))
  );

  private readonly _pointerDown$ = this.attachableDirective.event$.pipe(
    filter((x): x is PointerEvent => x.type === 'pointerdown'),
    filter((x) => this.shouldReactToEvent(x) && this.interactive()),
    tap((x) => (this._rippleStartEvent = x)),
    filter((x) => {
      if (!this.isTouch(x)) {
        this._state = 'waiting-for-click';
        this.startPressAnimation(x);
        return false;
      }
      return true;
    }),
    filter((x) => !this._checkBoundsAfterContextMenu || this.inBounds(x)),
    tap(() => {
      this._checkBoundsAfterContextMenu = false;
      this._state = 'touch-delay';
    }),
    delay(150),
    tap((x) => {
      if (this._state === 'touch-delay') {
        this._state = 'holding';
        this.startPressAnimation(x);
      }
    })
  );

  private readonly _click$ = this.attachableDirective.event$.pipe(
    filter((x) => x.type === 'click' && this.interactive()),
    tap(() => {
      if (this._state === 'waiting-for-click') {
        this.endPressAnimation();
      } else if (this._state === 'inactive') {
        this.startPressAnimation();
        this.endPressAnimation();
      }
    })
  );

  private readonly _pointerCancel$ = this.attachableDirective.event$.pipe(
    filter((x) => x.type === 'pointercancel'),
    tap(() => this.endPressAnimation())
  );

  private readonly _contextMenu$ = this.attachableDirective.event$.pipe(
    filter((x) => x.type === 'contextmenu'),
    tap(() => {
      this._checkBoundsAfterContextMenu = true;
      this.endPressAnimation();
    })
  );

  constructor() {
    super();
    this.attachableDirective.events.set([
      'click',
      'contextmenu',
      'pointercancel',
      'pointerdown',
      'pointerenter',
      'pointerleave',
      'pointerup',
    ]);
    this._pointerUp$.subscribe();
    this._pointerDown$.subscribe();
    this._click$.subscribe();
    this._pointerCancel$.subscribe();
    this._contextMenu$.subscribe();
  }

  private determineRippleSize() {
    const { height, width } = this.hostElement.getBoundingClientRect();
    const maxDim = Math.max(height, width);
    const softEdgeSize = Math.max(0.35 * maxDim, 75);

    const initialSize = Math.floor(maxDim * 0.2);
    const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
    const maxRadius = hypotenuse + 10;

    const rippleScale = `${(maxRadius + softEdgeSize) / initialSize}`;
    const rippleSize = `${initialSize}px`;

    return {
      initialSize,
      rippleScale,
      rippleSize,
    };
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

  private getTranslationCoordinates(
    initialSize: number,
    positionEvent?: Event
  ) {
    const { height, width } = this.hostElement.getBoundingClientRect();
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
    this.activated.set(true);
    this._growAnimation?.cancel();
    const { initialSize, rippleSize, rippleScale } = this.determineRippleSize();
    const { startPoint, endPoint } = this.getTranslationCoordinates(
      initialSize,
      positionEvent
    );
    const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
    const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;

    this._growAnimation = this.hostElement.animate(
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
        pseudoElement: '::after',
        duration: 450,
        easing: EASING.standard,
        fill: 'forwards',
      }
    );
  }

  private async endPressAnimation() {
    this._rippleStartEvent = undefined;
    this._state = 'inactive';
    const animation = this._growAnimation;
    let pressAnimationPlayState = Infinity;
    if (typeof animation?.currentTime === 'number') {
      pressAnimationPlayState = animation.currentTime;
    } else if (animation?.currentTime) {
      pressAnimationPlayState = animation.currentTime.to('ms').value;
    }

    if (pressAnimationPlayState >= 225) {
      this.activated.set(false);
      return;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 225 - pressAnimationPlayState);
    });

    if (this._growAnimation !== animation) {
      // A new press animation was started. The old animation was canceled and
      // should not finish the pressed state.
      return;
    }

    this.activated.set(false);
  }

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

  private inBounds({ x, y }: PointerEvent) {
    const { top, left, bottom, right } =
      this.hostElement.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  private isTouch({ pointerType }: PointerEvent) {
    return pointerType === 'touch';
  }
}
