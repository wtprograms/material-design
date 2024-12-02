import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { MdComponent } from '../md.component';
import { CommonModule, isPlatformServer } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { openClose } from '../../common/rxjs/open-close';
import { DURATION } from '../../common/motion/duration';
import { EASING } from '../../common/motion/easing';
import { ButtonType } from '../button/button.component';
import { MdElevationComponent } from '../elevation/elevation.component';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.component';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.component';
import { MdRippleComponent } from '../ripple/ripple.component';
import { MdFabLabelDirective } from './fab-label.directive';
import { MdFabIconDirective } from './fab-icon.directive';
import { dispatchActivationClick } from '../../common/events/dispatch-activation-click';

export type FabSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'md-fab',
  templateUrl: './fab.component.html',
  styleUrl: './fab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdElevationComponent,
    MdFocusRingComponent,
    MdEmbeddedButtonComponent,
    MdRippleComponent,
    CommonModule,
  ],
  host: {
    '[class]': 'size() + " " + openCloseState()',
    '[class.disabled]': 'disabled()',
    '[class.lowered]': 'lowered()',
    '(click)': 'click($event)',
  },
})
export class MdFabComponent extends MdComponent {
  readonly type = input<ButtonType>('button');
  readonly size = input<FabSize>('medium');
  readonly disabled = input(false);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly lowered = input(false);
  readonly elevationLevel = computed(() => (this.lowered() ? 1 : 3));
  readonly open = model(true);
  readonly grow = input(false);
  readonly grew = output();

  readonly openCloseState = toSignal(openClose(this.open));

  private readonly _icon = contentChild<MdFabIconDirective, ElementRef<HTMLElement>>(MdFabIconDirective, { read: ElementRef });
  private readonly _label = contentChild<MdFabIconDirective, ElementRef<HTMLElement>>(MdFabLabelDirective, { read: ElementRef });
  private readonly _labelSpan =
    viewChild<ElementRef<HTMLSpanElement>>('labelSpan');
  private readonly _growElement =
    viewChild<ElementRef<HTMLElement>>('growElement');

  private readonly _button = viewChild(MdEmbeddedButtonComponent);

  private get _labelWidth() {
    const label = this._label();
    if (!label) {
      return 0;
    }
    const labelWidth = label.nativeElement.cloneNode(true) as HTMLElement;
    labelWidth.className = 'label-width';
    this.hostElement.appendChild(labelWidth);
    const width = labelWidth.offsetWidth;
    labelWidth.remove();
    return width;
  }

  private _animation?: Animation;

  constructor() {
    super();
    effect(() => {
      const state = this.openCloseState();
      const labelSpan = this._labelSpan()?.nativeElement;
      const open = this.open();
      const icon = this._icon();
      const label = this._label();
      this._animation?.cancel();
      if (!labelSpan || isPlatformServer(this._platformId)) {
        return;
      }

      if (!label) {
        return;
      }

      if (!icon) {
        labelSpan.style.width = 'auto';
        label.nativeElement.style.marginInlineStart = '0';
        labelSpan.style.display = 'inline-flex';
        return;
      } else {
        labelSpan.style.width = '';
        label.nativeElement.style.marginInlineStart = '';
        labelSpan.style.display = '';
      }

      if (state === 'opening' || state === 'closing') {
        this.animate(labelSpan, open);
      }
    });
  }

  async animateGrow() {
    if (!this.grow()) {
      return;
    }
    const timings: OptionalEffectTiming = {
      easing: EASING.linear,
      duration: DURATION.medium2,
      fill: 'forwards',
    };

    const hostRect = this.hostElement.getBoundingClientRect();
    const style: any = {
      top: ['0', `${-hostRect.top}px`],
      left: ['0', `${-hostRect.left}px`],
      right: [
        '0',
        `${-(window.innerWidth - hostRect.left - hostRect.width)}px`,
      ],
      bottom: [
        '0',
        `${-(window.innerHeight - hostRect.top - hostRect.height)}px`,
      ],
      opacity: ['0.2', '0.5'],
    };

    const growAnimation = this._growElement()!.nativeElement.animate(
      style,
      timings
    );
    try {
      await growAnimation.finished;
    } catch {}
    const transparentAnimation = this._growElement()!.nativeElement.animate(
      {
        opacity: ['0.5', '0'],
      },
      timings
    );
    try {
      await transparentAnimation.finished;
    } catch {}
    growAnimation.cancel();
    transparentAnimation.cancel();
    this.grew.emit();
  }

  private animate(label: HTMLElement | undefined, open: boolean) {
    const timings: OptionalEffectTiming = {
      easing: EASING.standardDecelerate,
      duration: DURATION.short4,
      fill: 'forwards',
    };

    const width = this._labelWidth + 8;
    const style: any = {
      width: ['0px', `${width}px`],
    };

    if (!open) {
      style.width = style.width.reverse();
      timings.easing = EASING.standardAccelerate;
      timings.duration = DURATION.short3;
    }

    this._animation = label?.animate(style, timings);
  }

  async click(event: Event) {
    if (this.grow()) {
      event.preventDefault();
      await this.animateGrow();
      dispatchActivationClick(this._button()!.hostElement, false);
    }
  }
}
