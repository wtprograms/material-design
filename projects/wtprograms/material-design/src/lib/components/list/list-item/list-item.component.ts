import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  model,
  contentChild,
  effect,
} from '@angular/core';
import { MdAvatarComponent } from '../../avatar/avatar.component';
import { MdBadgeComponent } from '../../badge/badge.component';
import { MdEmbeddedBadgeDirective } from '../../badge/embedded-badge.directive';
import { MdCheckComponent } from '../../check/check.component';
import { MdDivider } from '../../divider/divider.component';
import { MdEmbeddedButtonComponent } from '../../embedded-button/embedded-button.component';
import { MdFocusRingComponent } from '../../focus-ring/focus-ring.component';
import { MdIconButtonComponent } from '../../icon-button/icon-button.component';
import { MdRippleComponent } from '../../ripple/ripple.component';
import { MdTintComponent } from '../../tint/tint.component';
import { MdComponent } from '../../../common/base/md.component';
import { dispatchActivationClick } from '../../../common/events/dispatch-activation-click';

@Component({
  selector: 'md-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdEmbeddedButtonComponent,
    CommonModule,
    MdBadgeComponent,
    MdDivider,
    MdFocusRingComponent,
    MdTintComponent,
    MdRippleComponent,
  ],
  hostDirectives: [
    {
      directive: MdEmbeddedBadgeDirective,
      inputs: ['dot: badgeDot', 'text: badgeText'],
    },
  ],
  host: {
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.selected]': 'selected() ? "" : null',
    '[attr.split]': 'split() ? "" : null',
    '[attr.top]': 'top() ? "" : null',
    '[attr.interactive]': 'interactive() ? "" : null',
    '[attr.large]': 'large() ? "" : null',
    '(click)': 'click()',
  },
})
export class MdListItemComponent extends MdComponent {
  readonly embeddedBadge = inject(MdEmbeddedBadgeDirective);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly disabled = input(false);
  readonly selected = model(false);
  readonly split = model(false);
  readonly interactive = model(false);
  readonly top = model(false);
  readonly large = model(false);
  readonly check = contentChild(MdCheckComponent);
  readonly iconButton = contentChild(MdIconButtonComponent);
  readonly avatar = contentChild(MdAvatarComponent);
  readonly value = input<boolean | number | string>();

  constructor() {
    super();
    effect(() => {
      this.check()?.disabled.set(this.disabled());
      this.iconButton()?.disabled.set(this.disabled());
      this.avatar()?.disabled.set(this.disabled());
    });
  }

  click() {
    if (this.split() || !this.interactive()) {
      return;
    }

    if (this.check()) {
      dispatchActivationClick(this.check()!.hostElement, false);
    }
  }
}
