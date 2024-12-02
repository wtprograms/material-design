import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { MdComponent } from '../md.component';
import {
  delay,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  of,
  skip,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { MdAttachableDirective } from '../../directives/attachable.directive';
import {
  autoUpdate,
  computePosition,
  flip,
  Middleware,
  MiddlewareState,
  offset,
  Placement,
  shift,
  Side,
  Strategy,
} from '@floating-ui/dom';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { openClose, OpenCloseState } from '../../common/rxjs/open-close';
import { isPlatformBrowser } from '@angular/common';
import { DURATION } from '../../common/motion/duration';
import { EASING } from '../../common/motion/easing';

export type PopoverTrigger =
  | 'click'
  | 'hover'
  | 'focus'
  | 'contextmenu'
  | 'manual';

export interface PopoverPosition {
  placement: Placement;
  top?: string;
  bottom?: string;
  start: string;
  targetWidth: string;
}

@Component({
  selector: 'md-popover',
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
  host: {
    '[class]': 'openCloseState() + " " + strategy()',
    '[style.top]': 'position()?.top',
    '[style.bottom]': 'position()?.bottom',
    '[style.inset-inline-start]': 'position()?.start',
  },
})
export class MdPopoverComponent extends MdComponent {
  private readonly _attachable = inject(MdAttachableDirective);

  readonly trigger = input<PopoverTrigger>('click');
  readonly open = model(false);
  readonly offset = input(0);
  readonly flip = input(true);
  readonly shift = input(true);
  readonly delay = input(0);
  readonly placement = input<Placement>('bottom');
  readonly strategy = input<Strategy>('absolute');
  readonly hoverCloseOnPointerLeave = input(true);
  readonly useTargetWidth = input(false);

  private readonly _position = signal<PopoverPosition | undefined>(undefined);
  readonly position = this._position.asReadonly();
  private _animation?: Animation;

  private readonly _targetEventOpen$ = this._attachable.targetEvent$.pipe(
    filter(() => this.trigger() !== 'manual'),
    filter(
      (event) =>
        (event.type === 'click' && this.trigger() === 'click') ||
        (event.type === 'pointerenter' && this.trigger() === 'hover') ||
        (event.type === 'pointerleave' && this.trigger() === 'hover') ||
        (event.type === 'contextmenu' && this.trigger() === 'contextmenu')
    ),
    switchMap((event) => {
      if (event.type === 'contextmenu') {
        event.preventDefault();
      }
      if (event.type === 'pointerenter' && this.trigger() === 'hover') {
        if (this.open()) {
          return of({});
        }
        return of(true).pipe(
          delay(this.delay()),
          takeUntilDestroyed(this._destroyRef),
          takeUntil(
            this._attachable.targetEvent$.pipe(
              filter((x) => x.type === 'pointerleave')
            )
          )
        );
      }
      if (event.type === 'pointerleave' && this.trigger() === 'hover') {
        if (
          !this.hoverCloseOnPointerLeave() &&
          (this.openCloseState() === 'opened' ||
            this.openCloseState() === 'opening')
        ) {
          if (this.open()) {
            return of({});
          }
          return of(true);
        }
        if (!this.open()) {
          return of({});
        }
        return of(false);
      }
      if (this.open()) {
        return of({});
      }
      return of(true);
    }),
    filter((x) => typeof x === 'boolean')
  );

  private readonly _documentClick$ = fromEvent(this._document, 'click').pipe(
    takeUntilDestroyed(this._destroyRef),
    filter((event) => {
      const targetElement = this._attachable.targetElement();
      if (!this.open() || !targetElement) {
        return false;
      }
      const path = event.composedPath();
      if (path.includes(this.hostElement) || path.includes(targetElement)) {
        return false;
      }
      return true;
    }),
    map(() => false)
  );
  
  readonly openCloseStateChange = output<OpenCloseState>();

  readonly openCloseState = toSignal(
    openClose(
      merge(
        toObservable(this.open).pipe(skip(1)),
        this._targetEventOpen$,
        this._documentClick$,
        fromEvent(this.hostElement, 'popover-close').pipe(map(() => false))
      ).pipe(
        filter(() => isPlatformBrowser(this._platformId)),
        distinctUntilChanged(),
        tap((open) => {
          if (open) {
            this._stopPositioning = autoUpdate(
              this._attachable.targetElement(),
              this.hostElement,
              () => this.computePosition(),
              {
                elementResize: false,
              }
            );
          } else {
            this._stopPositioning?.();
          }
          this.animate(open);
          if (this.open() !== open) {
            this.open.set(open);
          }
        }),
        takeUntilDestroyed(this._destroyRef)
      ), 'long1'
    ).pipe(tap((state) => this.openCloseStateChange.emit(state)))
  );

  private _stopPositioning?: () => void;

  constructor() {
    super();
    this.hostElement.popover = 'manual';
  }

  private getHeight() {
    this.hostElement.classList.add('height');
    const height = this.hostElement.offsetHeight;
    this.hostElement.classList.remove('height');
    return height;
  }

  async computePosition() {
    const target = this._attachable.targetElement();
    if (!target) {
      return;
    }
    if (this.useTargetWidth()) {
      this.hostElement.style.width = target.offsetWidth + 'px';
    }
    const middleware: any[] = [
      offset(this.offset()),
      this.flip() ? flip() : undefined,
      this.shift() ? shift() : undefined,
    ];
    let height = this.hostElement.offsetHeight;
    if (this.openCloseState() === 'closed') {
      height = this.getHeight();
      const setFixedHeight: () => Middleware = () => ({
        name: 'setFixedHeight',
        fn: (state: MiddlewareState) => {
          state.rects.floating.height = height;
          return state;
        },
      });
      middleware.unshift(setFixedHeight());
    }
    const result = await computePosition(target, this.hostElement, {
      middleware,
      placement: this.placement(),
      strategy: this.strategy(),
    });
    const side = result.placement.split('-')[0] as Side;
    const position: PopoverPosition = {
      placement: result.placement,
      start: result.x + 'px',
      targetWidth: target.offsetWidth + 'px',
    };
    if (side === 'top') {
      position.bottom = window.innerHeight - result.y - height + 'px';
      position.top = 'auto';
    } else {
      position.top = result.y + 'px';
      position.bottom = 'auto';
    }
    this._position.set(position);
  }

  private async animate(open: boolean) {
    this._animation?.cancel();
    const timings: OptionalEffectTiming = {
      easing: EASING.standardDecelerate,
      duration: DURATION.short4,
      fill: 'forwards',
    };

    if (open) {
      this.hostElement.style.display = 'inline-flex';
      this.hostElement.showPopover();
    }

    const height = this.getHeight();
    const style: any = {
      opacity: ['0', '1'],
      height: ['0px', `${height}px`],
    };

    if (!open) {
      style.height = style.height.reverse();
      style.opacity = style.opacity.reverse();
      timings.easing = EASING.standardAccelerate;
      timings.duration = DURATION.short3;
    }

    this._animation = this.hostElement.animate(style, timings);
    try {
      await this._animation.finished;
      this._animation.cancel();
    } catch {}
    this.hostElement.style.height = open ? 'fit-content' : '0px';

    if (!open) {
      this.hostElement.style.display = 'none';
      this.hostElement.hidePopover();
    }
  }
}
