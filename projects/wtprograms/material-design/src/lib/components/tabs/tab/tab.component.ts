import { ChangeDetectionStrategy, Component, contentChild, effect, inject, model } from '@angular/core';
import { MdComponent } from '../../md.component';
import { MdBadgeUserDirective } from '../../badge/badge-user.directive';
import { MdBadgeModule } from '../../badge/badge.module';
import { MdEmbeddedButtonModule } from '../../embedded-button/embedded-button.module';
import { MdFocusRingModule } from '../../focus-ring/focus-ring.module';
import { MdIconComponent } from '../../icon/icon.component';
import { MdRippleModule } from '../../ripple/ripple.module';
import { MdTabsComponent } from '../tabs.component';

@Component({
  selector: 'md-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdBadgeModule, MdFocusRingModule, MdRippleModule, MdEmbeddedButtonModule],
  hostDirectives: [
    {
      directive: MdBadgeUserDirective,
      inputs: ['badgeDot', 'badgeNumber'],
    },
  ],
  host: {
    '[class.selected]': 'selected()',
    '[class.disabled]': 'disabled()',
  }
})
export class MdTabComponent extends MdComponent {
  readonly badgeUser = inject(MdBadgeUserDirective);
  readonly selected = model(false);
  readonly disabled = model(false);

  private readonly _iconChild = contentChild(MdIconComponent, {
    read: MdIconComponent,
  });
  private readonly _tabs = inject(MdTabsComponent);

  constructor() {
    super();
    effect(() => {
      const dot = this.badgeUser.badgeDot();
      const number = this.badgeUser.badgeNumber();
      const iconChild = this._iconChild();
      const secondary = this._tabs.secondary();
      if (!iconChild) {
        return;
      }

      if (secondary) {
        iconChild.badgeUser.badgeDot.set(false);
        iconChild.badgeUser.badgeNumber.set(0);
      } else {
        iconChild.badgeUser.badgeDot.set(dot);
        iconChild.badgeUser.badgeNumber.set(number);
      }
    });
  }
}
