import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  signal,
  model,
  ElementRef,
  DestroyRef,
  PLATFORM_ID,
  computed,
  isSignal,
  effect,
} from '@angular/core';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  Placement,
  shift,
  Side,
} from '@floating-ui/dom';
import {
  delay,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { PopoverTrigger } from './popover-trigger';
import { getTargetElement } from '../../directives/attachable/get-target-element';
import { MdComponent } from '../../common/base/md.component';
import { EASING, DURATION } from '../../common/motion';
import { MdAttachableDirective } from '../../directives/attachable/attachable.directive';
import { TargetType } from '../../directives/attachable/target-type';

interface PopoverPosition {
  placement: Placement;
  top?: string;
  start: string;
  transformOrigin: 'top' | 'bottom';
  targetWidth: string;
}

@Component({
  selector: 'md-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
  host: {
    '[attr.opened]': 'opened() ? "" : null',
    '[style.top]': 'position()?.top',
    '[style.bottom]': 'position()?.bottom',
    '[style.inset-inline-start]':
      '!customStart() && position()?.start ? position()?.start : null',
    '[style.transform-origin]': 'position()?.transformOrigin',
    '[style.position]': 'strategy()',
  },
})
export class MdPopoverComponent extends MdComponent {
  private readonly _attachable = inject(MdAttachableDirective);
  readonly trigger = input<PopoverTrigger>('click');
  readonly positioningTarget = input<TargetType>();
  readonly _positioningTargetElement = computed(() => {
    let target = this.positioningTarget();
    if (isSignal(target)) {
      target = target();
    }
    return getTargetElement(this.document, undefined, target);
  });
  readonly flip = input(true);
  readonly shift = input(true);
  readonly offset = input(0);
  readonly openDelay = input(0);
  readonly placement = input<Placement>('bottom');
  readonly closeOnLeave = input(true);
  readonly targetWidth = input(false);
  readonly position = signal<PopoverPosition | undefined>(undefined);
  readonly open = model(false);
  readonly closedTransform = input('scaleY(0)');
  readonly openedTransform = input('scaleY(1)');
  readonly customStart = input(false);
  readonly strategy = input<'fixed' | 'absolute'>('fixed');
  readonly native = input(true);

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _document = inject(DOCUMENT);
  private readonly _hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private readonly _targetOpen$ = this._attachable.targetEvent$.pipe(
    filter(() => this.trigger() !== 'manual'),
    filter(
      (event) =>
        (event.type === 'click' && this.trigger() === 'click') ||
        (event.type === 'pointerenter' && this.trigger() === 'hover') ||
        (event.type === 'pointerleave' && this.trigger() === 'hover') ||
        (event.type === 'contextmenu' && this.trigger() === 'contextmenu') ||
        (event.type === 'focusin' && this.trigger() === 'focus') ||
        (event.type === 'focusout' && this.trigger() === 'focus') ||
        (event.type === 'pointerdown' && this.trigger() === 'mousedown') ||
        (event.type === 'pointerup' && this.trigger() === 'mousedown')
    ),
    switchMap((event) => {
      if (event.type === 'contextmenu') {
        event.preventDefault();
      }
      if (
        (event.type === 'pointerenter' && this.trigger() === 'hover') ||
        (event.type === 'focusin' && this.trigger() === 'focus') ||
        (event.type === 'pointerdown' && this.trigger() === 'mousedown')
      ) {
        if (this.open()) {
          return of({});
        }
        return of(true).pipe(
          delay(this.openDelay()),
          takeUntil(
            this._attachable.targetEvent$.pipe(
              filter((x) => x.type === 'pointerleave' || x.type === 'focusout')
            )
          )
        );
      }
      if (
        (event.type === 'pointerleave' && this.trigger() === 'hover') ||
        (event.type === 'focusout' && this.trigger() === 'focus') ||
        (event.type === 'pointerup' && this.trigger() === 'mousedown')
      ) {
        if (!this.closeOnLeave() && this.open()) {
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

  private readonly _documentOpen$ = fromEvent(this._document, 'click').pipe(
    takeUntilDestroyed(this._destroyRef),
    filter((event) => {
      const targetElement = this._attachable.targetElement();
      if (!this.open() || !targetElement) {
        return false;
      }
      const path = event.composedPath();
      if (path.includes(this._hostElement) || path.includes(targetElement)) {
        return false;
      }
      return true;
    }),
    map(() => false)
  );

  readonly opened = toSignal(
    merge(
      toObservable(this.open),
      this._targetOpen$,
      this._documentOpen$,
      fromEvent(this._hostElement, 'closepopover').pipe(map(() => false))
    ).pipe(
      filter(() => isPlatformBrowser(this._platformId)),
      distinctUntilChanged(),
      tap((open) => {
        if (open) {
          this._stopPositioning = autoUpdate(
            this._positioningTargetElement() ??
              this._attachable.targetElement()!,
            this._hostElement,
            () => this.computePosition()
          );
        } else {
          this._stopPositioning?.();
        }
        this.animate(open);
        if (this.open() !== open) {
          this.open.set(open);
        }
      })
    )
  );

  private _animation?: Animation;
  private _stopPositioning?: () => void;

  constructor() {
    super();
    effect(() => {
      if (this.native()) {
        this._hostElement.popover = 'manual';
      } else {
        this._hostElement.popover = null;
      }
    });
  }

  async computePosition() {
    const target =
      this._positioningTargetElement() ?? this._attachable.targetElement();
    if (!target) {
      return;
    }
    if (this.targetWidth()) {
      this._hostElement.style.width = target.offsetWidth + 'px';
    } else {
      this._hostElement.style.width = '';
    }
    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const middleware: any[] = [
      offset(this.offset()),
      this.flip() ? flip() : undefined,
      this.shift() ? shift() : undefined,
    ];
    const result = await computePosition(target, this._hostElement, {
      middleware,
      placement: this.placement(),
      strategy: 'fixed',
    });
    const side = result.placement.split('-')[0] as Side;
    const position: PopoverPosition = {
      placement: result.placement,
      start: result.x + 'px',
      targetWidth: target.offsetWidth + 'px',
      transformOrigin: side === 'top' ? 'bottom' : 'top',
    };
    position.top = result.y + 'px';
    this.position.set(position);
  }

  private async animate(open: boolean) {
    this._animation?.cancel();
    const timings: OptionalEffectTiming = {
      easing: EASING.standardDecelerate,
      duration: DURATION.short4,
      fill: 'forwards',
    };

    if (open) {
      this._hostElement.style.display = 'inline-flex';
      if (this.native()) {
        this._hostElement.showPopover();
      }
    }

    const style: any = {
      opacity: ['0', '1'],
      transform: [this.closedTransform(), this.openedTransform()],
    };

    if (!open) {
      this._hostElement.style.overflow = '';
      style.transform = style.transform.reverse();
      style.opacity = style.opacity.reverse();
      timings.easing = EASING.standardAccelerate;
      timings.duration = DURATION.short3;
    }

    this._animation = this._hostElement.animate(style, timings);
    try {
      await this._animation.finished;
    } catch {}

    if (!open) {
      this._hostElement.style.display = 'none';
      if (this.native()) {
        this._hostElement.hidePopover();
      }
    }
  }
}
