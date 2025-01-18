import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  model,
  viewChild,
  ElementRef,
  contentChild,
  effect,
} from '@angular/core';
import { MdNavigationComponent } from '../navigation.component';
import { MdBadgeComponent } from '../../badge/badge.component';
import { MdEmbeddedBadgeDirective } from '../../badge/embedded-badge.directive';
import { MdEmbeddedButtonComponent } from '../../embedded-button/embedded-button.component';
import { MdFocusRingComponent } from '../../focus-ring/focus-ring.component';
import { MdIconComponent } from '../../icon/icon.component';
import { MdRippleComponent } from '../../ripple/ripple.component';
import { MdTintComponent } from '../../tint/tint.component';
import { MdComponent } from '../../../common/base/md.component';
import { dispatchCloseDialog } from '../../../common/events/dispatch-close-dialog';

@Component({
  selector: 'md-navigation-item',
  templateUrl: './navigation-item.component.html',
  styleUrls: ['./navigation-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdEmbeddedButtonComponent,
    CommonModule,
    MdBadgeComponent,
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
    '(click)': 'click()',
  },
})
export class MdNavigationItemComponent extends MdComponent {
  readonly embeddedBadge = inject(MdEmbeddedBadgeDirective);
  readonly type = input<string>('button');
  readonly href = input<string>();
  readonly target = input<string>();
  readonly disabled = input(false);
  readonly selected = model(false);
  readonly button = viewChild<
    MdEmbeddedButtonComponent,
    ElementRef<HTMLElement>
  >(MdEmbeddedButtonComponent, { read: ElementRef });
  readonly navigation = inject(MdNavigationComponent);
  private readonly _icon = contentChild(MdIconComponent);

  constructor() {
    super();
    effect(() => {
      const layout = this.navigation.layout();
      const dot = this.embeddedBadge.dot();
      const text = this.embeddedBadge.text();
      const icon = this._icon();
      if (!icon) {
        return;
      }
      if (layout !== 'drawer') {
        icon.embeddedBadge.dot.set(dot);
        icon.embeddedBadge.text.set(text);
      } else {
        icon.embeddedBadge.dot.set(false);
        icon.embeddedBadge.text.set(undefined);
      }
    });
  }

  click() {
    dispatchCloseDialog(this.hostElement);
  }
}
