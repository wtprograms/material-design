import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.module';
import { CommonModule } from '@angular/common';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.module';
import { MdRippleComponent } from '../ripple/ripple.module';
import { MdComponent } from '../../common/base/md.component';
import { IconButtonVariant } from './icon-button-variant';
import { MdEmbeddedBadgeDirective } from '../badge/embedded-badge.directive';
import { MdEmbeddedProgressIndicatorDirective } from '../progress-indicator/embedded-progress-indicator.directive';
import { MdIconComponent } from '../icon/icon.component';
import { MdProgressIndicatorComponent } from '../progress-indicator/progress-indicator.component';
import { MdTintComponent } from '../tint/tint.component';

@Component({
  selector: 'md-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdEmbeddedButtonComponent,
    CommonModule,
    MdIconComponent,
    MdFocusRingComponent,
    MdTintComponent,
    MdRippleComponent,
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
    '[attr.selected]': 'selected() ? "" : null',
  },
})
export class MdIconButtonComponent extends MdComponent {
  readonly embeddedBadge = inject(MdEmbeddedBadgeDirective);
  readonly embeddedProgressIndicator = inject(
    MdEmbeddedProgressIndicatorDirective
  );
  readonly variant = input<IconButtonVariant>('standard');
  readonly type = input<string>('button');
  readonly href = input<string>();
  readonly target = input<string>();
  readonly disabled = model(false);
  readonly selected = model(false);
  readonly custom = input(false);
  readonly filled = input(false);
  readonly value = input<boolean | number | string>();
}
