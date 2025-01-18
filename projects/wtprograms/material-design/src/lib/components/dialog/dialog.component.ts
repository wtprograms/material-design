import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  ElementRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter, tap } from 'rxjs';
import { MdButtonComponent } from '../button/button.component';
import { MdIconButtonComponent } from '../icon-button/icon-button.component';
import { MdTooltipComponent } from '../tooltip/tooltip.component';
import { MdComponent } from '../../common/base/md.component';
import { EASING, DURATION } from '../../common/motion';
import { observeMedia } from '../../common/signals/observe-media';

@Component({
  selector: 'md-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdIconButtonComponent, CommonModule, MdTooltipComponent],
  host: {
    '[attr.open]': 'open() ? "" : null',
    '[attr.fullscreen]': 'fullscreen() ? "" : null',
    '[attr.require-action]': 'notifyRequireAction() ? "" : null',
    '(document:keydown.escape)': 'escape($event)',
  },
})
export class MdDialogComponent extends MdComponent {
  readonly open = model(false);
  readonly fullscreen = input(false);
  readonly requireAction = input(false);
  readonly actions = contentChildren(MdButtonComponent);
  readonly notifyRequireAction = signal(false);
  private readonly _scrim =
    viewChild.required<ElementRef<HTMLDivElement>>('scrim');
  private readonly _dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly _container =
    viewChild.required<ElementRef<HTMLDivElement>>('container');

  readonly isMedium = observeMedia('medium');

  constructor() {
    super();
    effect(() => {
      const actions = this.actions();
      for (const action of actions) {
        action.variant.set('text');
      }
      const cancelAction = actions.find(
        (x) => x.hostElement.getAttribute('mdDialogAction') === 'cancel'
      );
      cancelAction?.hostElement.addEventListener('click', () =>
        this.open.set(false)
      );
    });
    toObservable(this.open)
      .pipe(
        filter(() => isPlatformBrowser(this.platformId)),
        tap((open) => this.animate(open))
      )
      .subscribe();
    toObservable(this.notifyRequireAction)
      .pipe(
        filter((x) => x),
        debounceTime(250),
        tap(() => this.notifyRequireAction.set(false))
      )
      .subscribe();
  }

  escape(event: KeyboardEvent) {
    event.preventDefault();
    this.scrimClick();
  }

  scrimClick() {
    if (this.requireAction()) {
      this.notifyRequireAction.set(true);
      return;
    }
    this.open.set(false);
  }

  private async animate(open: boolean) {
    if (open) {
      this.document.body.style.overflow = 'hidden';
      this._dialog().nativeElement.showModal();
    }

    const promises = [
      this.animateScrim(open),
      this.animateDialog(open),
      this.animateContainer(open),
    ];

    await Promise.all(promises);

    if (!open) {
      this.document.body.style.overflow = '';
      this._dialog().nativeElement.close();
    }
  }

  private async animateScrim(open: boolean) {
    const timings: OptionalEffectTiming = {
      easing: EASING.emphasizedDecelerate,
      duration: DURATION.long3,
      fill: 'forwards',
    };

    const style = {
      opacity: ['0', '0.32'],
    };

    if (!open) {
      style.opacity = style.opacity.reverse();
      timings.easing = EASING.emphasizedAccelerate;
      timings.duration = DURATION.short4;
    }

    await this._scrim()
      .nativeElement.animate(style, timings)
      .finished.catch(() => {});
  }

  private async animateDialog(open: boolean) {
    const timings: OptionalEffectTiming = {
      easing: EASING.emphasizedDecelerate,
      duration: DURATION.long3,
      fill: 'forwards',
    };

    const style = {
      opacity: ['0', '1'],
    };

    if (!open) {
      style.opacity = style.opacity.reverse();
      timings.easing = EASING.emphasizedAccelerate;
      timings.duration = DURATION.short4;
    }

    await this._dialog()
      .nativeElement.animate(style, timings)
      .finished.catch(() => {});
  }

  private async animateContainer(open: boolean) {
    const timings: OptionalEffectTiming = {
      easing: EASING.emphasizedDecelerate,
      duration: DURATION.long3,
      fill: 'forwards',
    };

    const style = {
      transform: ['translateY(-50%)', 'translateY(0)'],
    };

    if (this.fullscreen() && !this.isMedium()) {
      style.transform = ['translateY(50%)', 'translateY(0)'];
    }

    if (!open) {
      style.transform = style.transform.reverse();
      timings.easing = EASING.emphasizedAccelerate;
      timings.duration = DURATION.short4;
    }

    await this._container()
      .nativeElement.animate(style, timings)
      .finished.catch(() => {});
  }
}
