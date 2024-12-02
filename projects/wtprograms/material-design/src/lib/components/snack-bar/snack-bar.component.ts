import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { MdComponent } from '../md.component';
import { distinctUntilChanged, filter, tap } from 'rxjs';
import { MdAttachableDirective } from '../../directives/attachable.directive';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { openClose, OpenCloseState } from '../../common/rxjs/open-close';
import { isPlatformBrowser } from '@angular/common';
import { DURATION, durationToMilliseconds } from '../../common/motion/duration';
import { EASING } from '../../common/motion/easing';
import { MdButtonModule } from '../button/button.module';
import { MdIconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'md-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdIconButtonComponent, MdButtonModule],
  hostDirectives: [
    {
      directive: MdAttachableDirective,
      inputs: ['target'],
    },
  ],
  host: {
    '[class]': 'openCloseState()',
    '[class.multiline]': 'multiline()',
    '(touchstart)': 'touchStart($event)',
    '(touchmove)': 'touchMove($event)',
    '(touchend)': 'touchEnd($event)',
  },
})
export class MdSnackBarComponent extends MdComponent {
  readonly open = model(false);
  readonly closable = input(false);
  readonly close = output<Event>();
  readonly actionClick = output<Event>();
  readonly action = input<string>();
  readonly multiline = input(false);

  private _deltaX = 0;
  private _currentX = 0;
  private _animation?: Animation;

  readonly openCloseState = toSignal(
    openClose(
      toObservable(this.open).pipe(
        filter(() => isPlatformBrowser(this._platformId)),
        distinctUntilChanged(),
        tap((open) => this.animate(open)),
        takeUntilDestroyed(this._destroyRef)
      )
    ).pipe(tap((state) => this.openCloseStateChange.emit(state)))
  );
  readonly openCloseStateChange = output<OpenCloseState>();

  constructor() {
    super();
    this.hostElement.popover = 'manual';
  }

  touchStart(event: TouchEvent) {
    event.preventDefault();
    this.hostElement.style.transition = 'none';
    this._currentX = event.touches[0].clientX;
  }

  touchMove(event: TouchEvent) {
    event.preventDefault();
    this._deltaX = (this._currentX - event.touches[0].clientX) * -1;
    this.hostElement.style.transform = `translateX(${this._deltaX}px)`;
  }

  async touchEnd(event: Event) {
    event.preventDefault();
    this.hostElement.style.transition = '';
    const rect = this.hostElement.getBoundingClientRect();
    if (Math.abs(this._deltaX) > 150) {
      if (this._deltaX < 0) {
        this.hostElement.style.transform = `translateX(-${window.innerWidth + rect.width}px)`;
      } else {
        this.hostElement.style.transform = `translateX(${window.innerWidth + rect.width}px)`;
      }
      await new Promise((resolve) => setTimeout(resolve, durationToMilliseconds(DURATION.long4)));
      this.hostElement.style.transform = '';
      this.open.set(false);
    } else {
      this.hostElement.style.transform = '';
    }
    this._deltaX = 0;
  }

  closeClicked(event: Event) {
    this.close.emit(event);
    if (!event.defaultPrevented) {
      this.open.set(false);
    }
  }

  actionClicked(event: Event) {
    this.actionClick.emit(event);
    if (!event.defaultPrevented) {
      this.open.set(false);
    }
  }

  private getHeight() {
    this.hostElement.classList.add('height');
    const height = this.hostElement.offsetHeight;
    this.hostElement.classList.remove('height');
    return height;
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
