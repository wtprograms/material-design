import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MdComponent } from '../md.component';
import { MdElevationComponent } from '../elevation/elevation.component';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.component';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.component';
import { CommonModule } from '@angular/common';
import { MdRippleComponent } from '../ripple/ripple.component';
import { MdTooltipComponent } from '../tooltip/tooltip.component';
import { MdProgressIndicatorUserDirective } from '../progress-indicator/progress-indicator-user.directive';
import { MdProgressIndicatorModule } from '../progress-indicator/progress-indicator.module';

export type ButtonVariant =
  | 'elevated'
  | 'filled'
  | 'tonal'
  | 'outlined'
  | 'text'
  | 'plain';
export type ButtonType = 'button' | 'submit' | 'reset';

const ELEVATION_VARIANTS: ButtonVariant[] = ['elevated', 'filled', 'tonal'];

@Component({
  selector: 'md-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdElevationComponent,
    MdFocusRingComponent,
    MdEmbeddedButtonComponent,
    MdRippleComponent,
    CommonModule,
    MdProgressIndicatorModule
  ],
  hostDirectives: [
    {
      directive: MdProgressIndicatorUserDirective,
      inputs: [
        'progressValue',
        'progressMax',
        'progressIndeterminate',
      ]
    }
  ],
  host: {
    '[class]': 'variant()',
    '[class.disabled]': 'disabled()',
    '(click)': 'click()',
  },
})
export class MdButtonComponent extends MdComponent {
  readonly progressIndicatorUser = inject(MdProgressIndicatorUserDirective);
  readonly variant = input<ButtonVariant>('filled');
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly hasElevation = computed(() =>
    ELEVATION_VARIANTS.includes(this.variant())
  );
  readonly elevationLevel = computed(() =>
    this.variant() !== 'elevated' ? 0 : 1
  );

  private readonly _tooltip = inject(MdTooltipComponent, {
    host: true,
    optional: true,
  });

  click() {
    if (this.disabled()) {
      return;
    }

    if (this._tooltip) {
      this._tooltip.open.set(false);
    }
  }
}
