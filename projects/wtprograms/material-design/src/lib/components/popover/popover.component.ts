import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  model,
  OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import {
  attach,
  AttachableDirective,
} from '../../directives/attachable.directive';
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
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  animationContext,
  AnimationContextDirective,
  AnimationTriggers,
} from '../../directives/animation/animation-context.directive';
import { Animator } from '../../directives/animation/animator';
import { AnimationDirective } from '../../directives/animation/animation.directive';
import { openClose, OpenCloseState } from '../../common/rxjs/open-close';
import { ElevationComponent } from '../elevation/elevation.component';

export type PopoverTrigger = 'manual' | 'click' | 'hover' | 'contextmenu';

interface Position {
  top?: string;
  start?: string;
  placement?: Placement;
}

@Component({
  selector: 'md-popover',
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [ElevationComponent, AnimationDirective],
  hostDirectives: [
    AnimationContextDirective,
    {
      directive: AttachableDirective,
      inputs: ['target'],
    },
  ],
  host: {
    '[attr.strategy]': 'strategy()',
    '[style]': 'hostStyle()',
    '[state]': 'state()',
    '[style.width]': 'containerWidth()',
  },
})
export class PopoverComponent
  extends MaterialDesignComponent
  implements OnDestroy
{
  readonly attachableDirective = attach(
    'click',
    'pointerdown',
    'pointerenter',
    'pointerleave',
    'contextmenu'
  );
  readonly trigger = model<PopoverTrigger>('click');
  readonly flip = model(false);
  readonly shift = model(false);
  readonly offset = model(0);
  readonly delay = model(0);
  readonly placement = model<Placement>('bottom-start');
  readonly strategy = model<Strategy>('absolute');
  readonly native = model(true);
  readonly open = model(false);
  readonly manualClose = model(false);
  readonly useContainerWidth = model(false);

  readonly containerWidth = computed(() => {
    this.open();
    const useContainerWidth = this.useContainerWidth();
    if (!useContainerWidth) {
      return null;
    }
    const target = this.attachableDirective.targetElement();
    if (!target) {
      return null;
    }
    return `${target.offsetWidth}px`;
  });

  private readonly _position = signal<Position>({});
  private readonly _display = signal<'inline-flex' | 'none'>('none');
  private readonly _opacity = signal(0);
  private readonly _document = inject(DOCUMENT);

  private readonly _documentClick$ = fromEvent(this._document, 'click').pipe(
    map((event) => {
      const targetElement = this.attachableDirective.targetElement();
      if (this.state() !== 'opened' || !targetElement) {
        return;
      }
      const path = event.composedPath();
      if (path.includes(this.hostElement) || path.includes(targetElement)) {
        return undefined;
      }
      return false;
    }),
    filter((x) => x !== undefined)
  );

  private readonly _cancelTimer = new Subject<void>();
  private readonly _events$ = this.attachableDirective.event$.pipe(
    switchMap((event): Observable<boolean | unknown> => {
      if (event.type === 'pointerleave' && this.trigger() === 'hover') {
        this._cancelTimer.next();
        return this.manualClose() ? of({}) : of(false);
      }
      if (this.state() !== 'opened') {
        if (
          (event.type === 'click' && this.trigger() === 'click') ||
          (event.type === 'pointerenter' && this.trigger() === 'hover') ||
          (event.type === 'contextmenu' && this.trigger() === 'contextmenu')
        ) {
          if (event.type === 'contextmenu') {
            event.preventDefault();
          }
          return timer(this.delay()).pipe(
            takeUntil(this._cancelTimer),
            map(() => true)
          );
        }
      }
      return of({});
    }),
    map((x) => {
      if (this._closing) {
        this._closing = false;
        return;
      }
      return x;
    }),
    filter((x) => typeof x === 'boolean')
  );

  private readonly _openClose$ = openClose(this.open, 'long2', 'long3');
  readonly state = toSignal(this._openClose$, { initialValue: 'closed' });
  readonly stateChange = output<OpenCloseState>();

  readonly hostStyle = computed(
    (): Partial<CSSStyleDeclaration> => ({
      display: this._display(),
      opacity: this._opacity().toString(),
      top: this._position()?.top ?? '',
      left: this._position()?.start ?? '',
    })
  );

  readonly transformOrigin = computed(() => {
    const placement = this._position()?.placement ?? this.placement();
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
  });

  readonly animationTriggers: AnimationTriggers = {
    container: [
      new Animator('opening', {
        keyframes: { height: '100%' },
        options: { duration: 'short4', easing: 'standardDecelerate' },
      }),
      new Animator('closing', {
        keyframes: { height: '0' },
        options: {
          duration: 'short2',
          easing: 'standardAccelerate',
          delay: 'short1',
        },
      }),
    ],
    body: [
      new Animator('opening', {
        keyframes: { opacity: '1' },
        options: {
          duration: 'short4',
          easing: 'standardDecelerate',
          delay: 'short3',
        },
      }),
      new Animator('closing', {
        keyframes: { opacity: '0' },
        options: { duration: 'short2', easing: 'standardAccelerate' },
      }),
    ],
  };

  private readonly _platformId = inject(PLATFORM_ID);

  private _cancelAutoUpdate?: () => void;
  private _destroyRef = inject(DestroyRef);

  private _closing = false;

  constructor() {
    super();
    effect(() => this.stateChange.emit(this.state()));

    animationContext(this.animationTriggers);
    merge(this._documentClick$, this._events$)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((x) => this.open.set(x))
      )
      .subscribe();
    effect(() => {
      if (this.native()) {
        this.hostElement.popover = 'manual';
      } else {
        this.hostElement.popover = '';
      }
    });
    effect(
      () => {
        const state = this.state();
        if (state === 'opening') {
          if (
            this.attachableDirective.targetElement() &&
            isPlatformBrowser(this._platformId)
          ) {
            this._cancelAutoUpdate = autoUpdate(
              this.attachableDirective.targetElement()!,
              this.hostElement,
              this.updatePosition.bind(this)
            );
          }
          this._display.set('inline-flex');
          if (this.native() && isPlatformBrowser(this._platformId)) {
            this.hostElement.showPopover();
          }
          this._opacity.set(1);
        }
        if (state === 'closed') {
          this._display.set('none');
          this._opacity.set(0);
          if (this.native() && isPlatformBrowser(this._platformId)) {
            this.hostElement.hidePopover();
          }
        }
      },
      {
        allowSignalWrites: true,
      }
    );
    effect(() => (this.hostElement.popover = this.native() ? 'manual' : null));
  }

  override ngOnDestroy(): void {
    this._cancelAutoUpdate?.();
  }

  private async updatePosition() {
    const target = this.attachableDirective.targetElement();
    if (!target) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const middleware: any[] = [offset(this.offset)];
    if (this.flip()) {
      middleware.push(flip());
    }
    if (this.shift()) {
      middleware.push(shift());
    }
    const result = await computePosition(target, this.hostElement, {
      middleware,
      placement: this.placement(),
      strategy: this.strategy(),
    });
    this._position.set({
      start: `${result.x}px`,
      top: `${result.y}px`,
      placement: result.placement,
    });
    return result;
  }

  onClosePopover() {
    this._closing = true;
    this.open.set(false);
  }
}
