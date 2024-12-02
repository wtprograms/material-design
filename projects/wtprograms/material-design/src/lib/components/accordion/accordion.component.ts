import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  model,
  viewChild,
} from '@angular/core';
import { MdComponent } from '../md.component';
import { MdEmbeddedButtonModule } from '../embedded-button/embedded-button.module';
import { openClose } from '../../common/rxjs/open-close';
import { DURATION } from '../../common/motion/duration';
import { EASING } from '../../common/motion/easing';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { skip, tap } from 'rxjs';
import { MdIconModule } from '../icon/icon.module';
import { MdRippleModule } from '../ripple/ripple.module';
import { MdFocusRingModule } from '../focus-ring/focus-ring.module';

@Component({
  selector: 'md-accordion',
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdEmbeddedButtonModule,
    MdIconModule,
    MdFocusRingModule,
    MdRippleModule,
  ],
  host: {
    '[class]': 'openCloseState()',
  },
})
export class MdAccordionComponent extends MdComponent {
  readonly open = model(false);

  readonly openCloseState = toSignal(
    openClose(
      toObservable(this.open).pipe(
        skip(1),
        tap((open) => this.animate(open))
      )
    ),
    {
      initialValue: 'closed',
    }
  );

  private readonly _body = viewChild<ElementRef<HTMLElement>>('body');

  private getHeight() {
    const body = this._body()!.nativeElement;
    body.classList.add('height');
    const height = body.offsetHeight;
    body.classList.remove('height');
    return height;
  }

  private async animate(open: boolean) {
    const body = this._body()!.nativeElement;
    const timings: OptionalEffectTiming = {
      easing: EASING.standardDecelerate,
      duration: DURATION.short4,
      fill: 'forwards',
    };

    if (open) {
      body.style.display = 'inline-flex';
    }

    const height = this.getHeight();
    const style: any = {
      height: ['0px', `${height}px`],
    };

    if (!open) {
      style.height = style.height.reverse();
      timings.easing = EASING.standardAccelerate;
      timings.duration = DURATION.short3;
    }

    const animation = body.animate(style, timings);
    try {
      await animation.finished;
      animation.commitStyles();
      animation.cancel();
    } catch {}
    //body.style.height = open ? 'auto' : '0px';

    if (!open) {
      body.style.display = 'none';
    }
  }
}
