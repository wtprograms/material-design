import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  model,
  output,
  viewChild,
  ElementRef,
  inject,
  computed,
  effect,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { openClose, OpenCloseState } from '../../common/rxjs/open-close';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Animator } from '../../directives/animation/animator';
import {
  animationContext,
  AnimationContextDirective,
  AnimationTriggers,
} from '../../directives/animation/animation-context.directive';
import {
  animation,
  AnimationDirective,
} from '../../directives/animation/animation.directive';
import { combineLatest, filter, map, skip, tap } from 'rxjs';
import { ElevationComponent } from '../elevation/elevation.component';
import { SlotDirective } from '../../directives/slot.directive';

export type SheetPosition = 'top' | 'end' | 'bottom' | 'start';

@Component({
  selector: 'md-sheet',
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    CommonModule,
    AnimationDirective,
    ElevationComponent,
    SlotDirective,
  ],
  hostDirectives: [AnimationContextDirective, AnimationDirective],
  host: {
    '[attr.position]': 'position()',
    '[attr.state]': 'state()',
    '[attr.modal]': 'modal() || null',
    '[attr.icon]': `iconSlot()?.any() || null`,
    '[attr.headline]': `headlineSlot()?.any() || null`,
    '[attr.supportingText]': `supportingtext()?.any() || null`,
    '[attr.actions]': `actionSlot()?.any() || null`,
    '[style.--md-comp-sheet-width]': 'maxWidthPx() ?? null',
    '[style.--md-comp-sheet-height]': 'maxHeightPx() ?? null',
  },
})
export class SheetComponent extends MaterialDesignComponent {
  readonly modal = model(false);
  readonly open = model(false);
  readonly returnValue = model<string>();
  readonly cancel = output();
  readonly position = model<SheetPosition>('start');
  readonly maxWidth = model<number>();

  readonly iconSlot = this.slotDirective('icon');
  readonly headlineSlot = this.slotDirective('headline');
  readonly supportingtext = this.slotDirective('supportingText');
  readonly actionSlot = this.slotDirective('action');

  readonly maxWidthPx = computed(() =>
    this.maxWidth() &&
    (this.position() === 'start' || this.position() === 'end')
      ? `${this.maxWidth()}px`
      : '100%'
  );
  readonly maxHeight = model<number>();
  readonly maxHeightPx = computed(() =>
    this.maxHeight() &&
    (this.position() === 'top' || this.position() === 'bottom')
      ? `${this.maxHeight()}px`
      : '100%'
  );

  private readonly _openClose$ = openClose(this.open, 'long2', 'short4');
  readonly state = toSignal(this._openClose$, {
    initialValue: 'closed',
  });
  readonly stateChange = output<OpenCloseState>();

  private readonly _embeddedAnimations = computed(() => {
    if (this.modal()) {
      return [];
    }
    const maxWidth = this.maxWidthPx();
    const maxHeight = this.maxHeightPx();
    return [
      new Animator('opening', {
        keyframes: () => {
          return { maxWidth, maxHeight };
        },
        options: { duration: 'long1', easing: 'standardDecelerate' },
      }),
      new Animator('closing', {
        keyframes: () => {
          if (this.position() === 'top' || this.position() === 'bottom') {
            return { maxHeight: 0 };
          }
          return { maxWidth: 0 };
        },
        options: { duration: 'short3', easing: 'standardAccelerate' },
      }),
    ];
  });

  private readonly _dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  private getTranslate(amount: number) {
    const func =
      this.position() === 'top' || this.position() === 'bottom'
        ? 'translateY'
        : 'translateX';
    const percentageNumber =
      this.position() === 'start' || this.position() === 'top'
        ? amount * -1
        : amount;
    const percentage = amount === 0 ? 0 : percentageNumber + '%';
    return `${func}(${percentage})`;
  }

  private readonly _dialogAnimations: AnimationTriggers = {
    dialog: [
      new Animator('opening', {
        keyframes: () => ({
          transform: [this.getTranslate(100), this.getTranslate(0)],
        }),
        options: { duration: 'long1', easing: 'emphasizedDecelerate' },
      }),
      new Animator('closing', {
        keyframes: () => ({
          transform: [this.getTranslate(0), this.getTranslate(100)],
        }),
        options: { duration: 'short3', easing: 'emphasizedAccelerate' },
      }),
    ],
    scrim: [
      new Animator('opening', {
        keyframes: { opacity: 0.32 },
        options: { duration: 'long1', easing: 'emphasizedDecelerate' },
      }),
      new Animator('closing', {
        keyframes: { opacity: 0 },
        options: { duration: 'short3', easing: 'emphasizedAccelerate' },
      }),
    ],
  };

  private _isModalOpen = false;

  constructor() {
    super();
    effect(() => this.stateChange.emit(this.state()));
    animationContext(
      computed(() => (this.modal() ? this._dialogAnimations : {}))
    );
    animation(this.state, this._embeddedAnimations);
    toObservable(this.modal)
      .pipe(
        skip(1),
        map(() => [
          ...this._embeddedAnimations(),
          ...Object.values(this._dialogAnimations).flat(),
        ]),
        tap((x) => {
          for (const animator of x) {
            animator.stop();
          }
        })
      )
      .subscribe();

    combineLatest({
      state: toObservable(this.state),
      modal: toObservable(this.modal),
    })
      .pipe(
        filter(({ modal }) => modal),
        tap(({ state }) => {
          const openModal = () => {
            this._document.body.style.overflow = 'hidden';
            if (isPlatformBrowser(this.platformId)) {
              this._dialog()?.nativeElement.showModal();
              this._isModalOpen = true;
            }
          };
          if (state === 'opened' && !this._isModalOpen) {
            openModal();
          }

          if (state === 'opening') {
            openModal();
          }
          if (state === 'closed') {
            this._document.body.style.overflow = '';
            if (isPlatformBrowser(this.platformId)) {
              this._dialog()?.nativeElement.close();
              this._isModalOpen = false;
            }
          }
        })
      )
      .subscribe();
  }

  private readonly _document = inject(DOCUMENT);

  private _nextClickIsFromContent = false;
  private _escapePressedWithoutCancel = false;

  onDialogCancel(event: Event) {
    event.preventDefault();
    this._escapePressedWithoutCancel = false;
    this.open.set(false);
  }

  onDialogClose() {
    if (!this._escapePressedWithoutCancel) {
      this.cancel.emit();
    }

    this._escapePressedWithoutCancel = false;
    this._dialog()?.nativeElement?.dispatchEvent(
      new Event('cancel', { cancelable: true })
    );
  }

  onDialogKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape') {
      return;
    }

    this._escapePressedWithoutCancel = true;
    setTimeout(() => (this._escapePressedWithoutCancel = false));
  }

  onDialogClick() {
    if (this._nextClickIsFromContent) {
      this._nextClickIsFromContent = false;
      return;
    }

    this.cancel.emit();
    this.open.set(false);
  }

  onContainerContentClick() {
    this._nextClickIsFromContent = true;
  }
}
