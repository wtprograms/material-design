import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { MdComponent } from '../../common/base/md.component';
import { CommonModule } from '@angular/common';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.module';
import { MdRippleComponent } from '../ripple/ripple.module';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.module';
import { ButtonVariant } from './button-variant';
import { MdEmbeddedBadgeDirective } from '../badge/embedded-badge.directive';
import { MdEmbeddedProgressIndicatorDirective } from '../progress-indicator/embedded-progress-indicator.directive';
import { MdBadgeComponent } from '../badge/badge.component';
import { MdElevationComponent } from '../elevation/elevation.component';
import { MdProgressIndicatorComponent } from '../progress-indicator/progress-indicator.component';
import { MdTintComponent } from '../tint/tint.component';

@Component({
  selector: 'md-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MdTintComponent,
    MdFocusRingComponent,
    MdRippleComponent,
    MdElevationComponent,
    MdEmbeddedButtonComponent,
    MdBadgeComponent,
    MdProgressIndicatorComponent,
  ],
  hostDirectives: [
    {
      directive: MdEmbeddedBadgeDirective,
      inputs: ['dot: badgeDot', 'text: badgeText'],
    },
    {
      directive: MdEmbeddedProgressIndicatorDirective,
      inputs: [
        'indeterminate: progressIndicatorIndeterminate',
        'value: progressIndicatorValue',
        'max: progressIndicatorMax',
        'buffer: progressIndicatorBuffer',
      ],
    },
  ],
  host: {
    '[attr.variant]': 'variant() ? variant() : null',
    '[attr.disabled]': 'disabled() ? "" : null',
  },
})
export class MdButtonComponent extends MdComponent {
  readonly embeddedBadge = inject(MdEmbeddedBadgeDirective);
  readonly embeddedProgressIndicator = inject(
    MdEmbeddedProgressIndicatorDirective
  );
  readonly variant = model<ButtonVariant>('filled');
  readonly type = input<string>('button');
  readonly href = input<string>();
  readonly target = input<string>();
  readonly disabled = model(false);
  readonly value = input<boolean | number | string>();
  readonly hasElevation = computed(
    () =>
      ['elevated', 'filled', 'tonal'].includes(this.variant()) &&
      !this.disabled()
  );
  readonly elevationLevel = computed(() =>
    this.variant() === 'elevated' ? 1 : 0
  );

  click(event: Event) {}
}
