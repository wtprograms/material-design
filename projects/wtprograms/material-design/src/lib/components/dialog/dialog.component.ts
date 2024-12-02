import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  model,
  viewChild,
} from '@angular/core';
import { MdComponent } from '../md.component';
import { skip, tap } from 'rxjs';
import { CommonModule, isPlatformServer } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DURATION } from '../../common/motion/duration';
import { EASING } from '../../common/motion/easing';

@Component({
  selector: 'dialog[mdDialog]',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdDialogComponent extends MdComponent<HTMLDialogElement> {
  readonly open = model(false);

  private readonly _contentElement =
    viewChild<ElementRef<HTMLElement>>('content');
  private readonly _containerHostElement =
    viewChild<ElementRef<HTMLElement>>('containerHost');
  private readonly _containerElement =
    viewChild<ElementRef<HTMLElement>>('container');

  private _abortController?: AbortController;

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

  @HostListener('document:keydown.escape')
  escape() {
    this.open.set(false);
  }

  scrimClick() {
    this.open.set(false);
  }

  private async animate(opened: boolean) {
    if (opened) {
      this.hostElement.style.display = 'inline-flex';
      this.hostElement.showModal();
    }

    this._abortController?.abort();
    this._abortController = new AbortController();

    const promises = [
      this.animateHost(opened),
      this.animateContainerHost(opened),
    ].map(async (animation) => {
      this._abortController?.signal.addEventListener('abort', () =>
        animation.cancel()
      );
      await animation.finished.catch(() => {});
      animation.commitStyles();
    });

    await Promise.all(promises);

    if (!opened) {
      this.hostElement.close();
      this.hostElement.style.display = 'none';
    }
  }

  private animateHost(opened: boolean) {
    const timings: OptionalEffectTiming = {
      easing: EASING.emphasizedDecelerate,
      duration: DURATION.long3,
      fill: 'forwards',
    };

    const style = {
      opacity: ['0', '1'],
    };

    if (!opened) {
      style.opacity = style.opacity.reverse();
      timings.easing = EASING.emphasizedAccelerate;
      timings.duration = DURATION.short4;
    }

    return this.hostElement.animate(style, timings);
  }

  private animateContainerHost(opened: boolean) {
    const timings: OptionalEffectTiming = {
      easing: EASING.emphasizedDecelerate,
      duration: DURATION.long3,
      fill: 'forwards',
    };

    const style: any = {
      transform: [],
      height: [],
    };

    this._containerHostElement()!.nativeElement.style.height = 'auto';
    const containerHostRect =
      this._containerHostElement()!.nativeElement.getBoundingClientRect();

    const containerRect =
      this._containerElement()!.nativeElement.getBoundingClientRect();
    this._containerElement()!.nativeElement.style.height = `${containerRect.height}px`;
    style.transform = [
      `translateY(-${containerHostRect.height * 0.75}px)`,
      'translateY(0)',
    ];
    style.height = [
      `${containerHostRect.height * 0.25}px`,
      `${containerHostRect.height}px`,
    ];

    if (!opened) {
      style.transform = style.transform.reverse();
      style.height = style.height.reverse();
      timings.easing = EASING.emphasizedAccelerate;
      timings.duration = DURATION.short4;
    }

    const animation = this._containerHostElement()!.nativeElement.animate(
      style,
      timings
    );
    this._abortController?.signal.addEventListener('abort', () =>
      animation.cancel()
    );
    const reset = () => {
      this._containerElement()!.nativeElement.style.height = '';
      this._containerHostElement()!.nativeElement.style.height = '';
    };
    animation.onfinish = () => {
      animation.cancel();
      reset();
    };
    animation.oncancel = () => reset();
    return animation;
  }
}
