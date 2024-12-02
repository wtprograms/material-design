import { ChangeDetectionStrategy, Component, ElementRef, input, model, viewChild } from '@angular/core';
import { MdComponent } from '../md.component';
import { CommonModule, isPlatformServer } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { skip, tap } from 'rxjs';
import { DURATION } from '../../common/motion/duration';
import { EASING } from '../../common/motion/easing';

export type SheetSide = 'top' | 'bottom' | 'start' | 'end';

@Component({
  selector: 'dialog[mdSheet]',
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  host: {
    '[class]': 'side()',
  },
})
export class MdSheetComponent extends MdComponent<HTMLDialogElement> {
  readonly open = model(false);
  readonly side = input<SheetSide>('start');
  readonly embedded = input(false);

  private readonly _contentElement =
    viewChild<ElementRef<HTMLElement>>('content');
  private readonly _containerHostElement =
    viewChild<ElementRef<HTMLElement>>('containerHost');
  private readonly _scrimElement = viewChild<ElementRef<HTMLElement>>('scrim');

  constructor() {
    super();
    toObservable(this.open)
      .pipe(
        skip(1),
        tap((open) => {
          if (isPlatformServer(this._platformId)) {
            return;
          }
          this._document.body.style.overflow = open ? 'hidden' : '';
          this.animate(open);
          if (open) {
            this._contentElement()!.nativeElement!.scrollTop = 0;
          }
        })
      )
      .subscribe();
  }

  scrimClick() {
    this.open.set(false);
  }

  private async animate(opened: boolean) {
    const timings: OptionalEffectTiming = {
      easing: EASING.emphasizedDecelerate,
      duration: DURATION.long3,
      fill: 'forwards',
    };

    const func =
      this.side() === 'top' || this.side() === 'bottom'
        ? 'translateY'
        : 'translateX';
    const amount =
      this.side() === 'top' || this.side() === 'start' ? '-100%' : '100%';
    const transform = [`${func}(${amount})`, `${func}(0)`];

    const containerStyle: any = {
      transform,
    };
    const scrimStyle: any = {
      opacity: ['0', '0.32'],
    };

    if (!opened) {
      containerStyle.transform = containerStyle.transform.reverse();
      scrimStyle.opacity = scrimStyle.opacity.reverse();
      timings.easing = EASING.emphasizedAccelerate;
      timings.duration = DURATION.short4;
    }

    if (opened) {
      this.hostElement.style.display = 'inline-flex';
    }

    this._scrimElement()!.nativeElement.animate(scrimStyle, timings);
    const animation = this._containerHostElement()!.nativeElement.animate(
      containerStyle,
      timings
    );
    try {
      await animation.finished;
    } catch {}

    if (!opened) {
      this.hostElement.style.display = '';
    }
  }
}
