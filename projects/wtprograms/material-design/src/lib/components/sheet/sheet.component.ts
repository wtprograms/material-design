import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';
import { SheetDock } from './sheet-dock';
import { MdButtonComponent } from '../button/button.component';
import { MdComponent } from '../../common/base/md.component';
import { EASING, DURATION } from '../../common/motion';

@Component({
  selector: 'md-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.open]': 'open() ? "" : null',
    '[attr.dock]': 'dock()',
  },
})
export class MdSheetComponent extends MdComponent {
  readonly open = model(false);
  readonly dock = input<SheetDock>('start');
  private readonly _scrim =
    viewChild.required<ElementRef<HTMLDivElement>>('scrim');
  private readonly _dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly _container =
    viewChild.required<ElementRef<HTMLDivElement>>('container');
  readonly actions = contentChildren(MdButtonComponent);

  constructor() {
    super();
    this.hostElement.addEventListener('closedialog', () =>
      this.open.set(false)
    );
    effect(() => {
      const actions = this.actions();
      for (const action of actions) {
        if (action.hostElement.getAttribute('mdSheetAction') === 'submit') {
          action.variant.set('filled');
        } else if (
          action.hostElement.getAttribute('mdSheetAction') === 'cancel'
        ) {
          action.variant.set('outlined');
        }
      }
      const cancelAction = actions.find(
        (x) => x.hostElement.getAttribute('mdSheetAction') === 'cancel'
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
  }

  scrimClick() {
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

    const axis = this.dock() === 'top' || this.dock() === 'bottom' ? 'Y' : 'X';
    const offset =
      this.dock() === 'top' || this.dock() === 'start' ? -100 : 100;

    const style = {
      transform: [`translate${axis}(${offset}%)`, `translate${axis}(0)`],
    };

    if (!open) {
      style.transform = style.transform.reverse();
      timings.easing = EASING.emphasizedAccelerate;
      timings.duration = DURATION.short4;
    }

    const animation = this._container().nativeElement.animate(style, timings);

    await animation.finished.catch(() => {});

    if (!open) {
      animation.cancel();
    }
  }
}
