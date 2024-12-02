import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MdComponent } from '../md.component';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.component';
import { MdIconComponent } from '../icon/icon.component';
import { MdRippleComponent } from '../ripple/ripple.component';
import { ButtonType } from '../button/button.component';
import { MdBadgeUserDirective } from '../badge/badge-user.directive';
import { CommonModule } from '@angular/common';
import { MdBadgeComponent } from '../badge/badge.component';
import { MdEmbeddedButtonModule } from '../embedded-button/embedded-button.module';
import { MdProgressIndicatorUserDirective } from '../progress-indicator/progress-indicator-user.directive';
import { MdProgressIndicatorModule } from '../progress-indicator/progress-indicator.module';

export type IconButtonVariant =
  | 'standard'
  | 'filled'
  | 'tonal'
  | 'outlined'
  | 'plain';

@Component({
  selector: 'md-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdRippleComponent,
    MdFocusRingComponent,
    MdIconComponent,
    CommonModule,
    MdEmbeddedButtonModule,
    MdBadgeComponent,
    MdProgressIndicatorModule
  ],
  hostDirectives: [
    {
      directive: MdBadgeUserDirective,
      inputs: ['badgeDot', 'badgeNumber'],
    },
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
    '[class.selected]': 'selected()',
    '[class.disabled]': 'disabled()',
  },
})
export class MdIconButtonComponent extends MdComponent {
  readonly badgeUser = inject(MdBadgeUserDirective);
  readonly progressIndicatorUser = inject(MdProgressIndicatorUserDirective);
  readonly variant = input<IconButtonVariant>('standard');
  readonly selected = input(false);
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly customIcon = input(false);
  readonly filled = input<boolean>();
}
