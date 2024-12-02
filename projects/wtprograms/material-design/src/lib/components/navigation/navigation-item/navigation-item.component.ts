import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { MdBadgeUserDirective } from '../../badge/badge-user.directive';
import { MdBadgeComponent } from '../../badge/badge.component';
import { ButtonType } from '../../button/button.component';
import { MdEmbeddedButtonModule } from '../../embedded-button/embedded-button.module';
import { MdFocusRingComponent } from '../../focus-ring/focus-ring.component';
import { MdIconComponent } from '../../icon/icon.component';
import { MdComponent } from '../../md.component';
import { MdRippleComponent } from '../../ripple/ripple.component';
import { MdNavigationComponent } from '../navigation.component';

@Component({
  selector: 'md-navigation-item',
  templateUrl: './navigation-item.component.html',
  styleUrl: './navigation-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdRippleComponent,
    MdFocusRingComponent,
    CommonModule,
    MdEmbeddedButtonModule,
    MdBadgeComponent,
  ],
  hostDirectives: [
    {
      directive: MdBadgeUserDirective,
      inputs: ['badgeDot', 'badgeNumber'],
    },
  ],
  host: {
    '[class.selected]': 'selected()',
    '[class.disabled]': 'disabled()',
  },
})
export class MdNavigationItemComponent extends MdComponent {
  readonly badgeUser = inject(MdBadgeUserDirective);
  readonly selected = input(false);
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
  readonly href = input<string>();
  readonly target = input<string>();

  readonly navigation = inject(MdNavigationComponent);

  private readonly _iconChild = contentChild(MdIconComponent, {
    read: MdIconComponent,
  });
  readonly buttonElement = viewChild<ElementRef<HTMLElement>>('button');

  constructor() {
    super();
    effect(() => {
      const dot = this.badgeUser.badgeDot();
      const number = this.badgeUser.badgeNumber();
      const iconChild = this._iconChild();
      const layout = this.navigation.layout();
      if (!iconChild) {
        return;
      }

      if (layout === 'drawer' || this.disabled()) {
        iconChild.badgeUser.badgeDot.set(false);
        iconChild.badgeUser.badgeNumber.set(0);
      } else {
        iconChild.badgeUser.badgeDot.set(dot);
        iconChild.badgeUser.badgeNumber.set(number);
      }
    });
  }
}
