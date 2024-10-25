import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  model,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { AnimationDirective } from '../../directives/animation/animation.directive';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import {
  animationContext,
  AnimationContextDirective,
  AnimationTriggers,
} from '../../directives/animation/animation-context.directive';
import { Animator } from '../../directives/animation/animator';
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil, timer } from 'rxjs';
import { openClose } from '../../common/rxjs/open-close';
import { toSignal } from '@angular/core/rxjs-interop';
import { ElevationComponent } from '../elevation/elevation.component';

@Component({
  selector: 'md-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [IconButtonComponent, ElevationComponent, AnimationDirective],
  hostDirectives: [AnimationContextDirective],
  host: {
    '[attr.closeButton]': 'closeButton() || null',
    '[attr.actions]': 'actionSlot()?.any() || null',
    '[attr.multiline]': 'multiline() || null',
  },
})
export class SnackBarComponent extends MaterialDesignComponent {
  readonly multiline = model(false);
  readonly closeButton = model(false);
  readonly open = model(false);
  readonly autoDissmissTimeout = model(5000);

  readonly actionSlot = this.slotDirective('action');

  readonly animationTriggers: AnimationTriggers = {
    container: [
      new Animator('opening', {
        style: { display: 'inline-flex' },
        keyframes: { transform: 'scaleY(100%)' },
        options: { duration: 'short4', easing: 'standardDecelerate' },
      }),
      new Animator('closing', {
        keyframes: { transform: 'scaleY(0)' },
        options: {
          duration: 'short2',
          easing: 'standardAccelerate',
          delay: 'short1',
        },
      }),
      new Animator('closed', {
        style: { display: 'none', transform: 'scaleY(0)' },
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
  private readonly _closing$ = new Subject<void>();

  private readonly _openClose = openClose(this.open, 'long1', 'long1');
  readonly state = toSignal(this._openClose);

  constructor() {
    super();
    this.hostElement.popover = 'manual';
    animationContext(this.animationTriggers);

    effect(() => {
      const state = this.state();
      if (state === 'opening' && isPlatformBrowser(this._platformId)) {
        this.hostElement.showPopover();
      }
      if (state === 'closed' && isPlatformBrowser(this._platformId)) {
        this.hostElement.hidePopover();
        this._closing$.next();
      }
      if (state === 'opened') {
        if (this.autoDissmissTimeout() > 0) {
          timer(this.autoDissmissTimeout())
            .pipe(takeUntil(this._closing$))
            .subscribe(() => this.open.set(false));
        }
      }
    });
  }

  onActionClick() {
    this.open.set(false);
  }
}
