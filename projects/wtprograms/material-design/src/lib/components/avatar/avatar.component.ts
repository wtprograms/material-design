import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { MdComponent } from '../md.component';
import { CommonModule } from '@angular/common';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.component';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.component';
import { MdRippleComponent } from '../ripple/ripple.component';
import { dispatchActivationClick } from '../../common/events/dispatch-activation-click';
import { isActivationClick } from '../../common/events/is-activation-click';
import { MdBadgeUserDirective } from '../badge/badge-user.directive';
import { MdBadgeModule } from '../badge/badge.module';
import { MdProgressIndicatorModule } from '../progress-indicator/progress-indicator.module';
import { MdProgressIndicatorUserDirective } from '../progress-indicator/progress-indicator-user.directive';

@Component({
  selector: 'md-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdRippleComponent,
    MdFocusRingComponent,
    MdEmbeddedButtonComponent,
    CommonModule,
    MdBadgeModule,
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
    '[style.--md-comp-avatar-size]': 'size() ? size() : null',
    '[class.disabled]': 'disabled()',
    '(click)': 'click($event)',
  },
})
export class MdAvatarComponent extends MdComponent {
  readonly badgeUser = inject(MdBadgeUserDirective);
  readonly progressIndicatorUser = inject(MdProgressIndicatorUserDirective);
  readonly src = input<string>();
  readonly fullName = input<string>();
  readonly size = input<number>();
  readonly disabled = input(false);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly interactive = input(false);

  private readonly _buttonElement = viewChild(
    MdEmbeddedButtonComponent,
    {
      read: ElementRef,
    }
  );

  click(event: Event) {
    if (!this.interactive()) {
      return;
    }
    if (!isActivationClick(event)) {
      return;
    }

    dispatchActivationClick(this._buttonElement()?.nativeElement, false);
  }
}
