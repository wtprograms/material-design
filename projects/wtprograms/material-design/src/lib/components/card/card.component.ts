import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  model,
  input,
  contentChildren,
  effect,
} from '@angular/core';
import { MdComponent } from '../../common/base/md.component';
import { CardVariant } from './card-variant';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.module';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.module';
import { MdRippleComponent } from '../ripple/ripple.module';
import { MdAvatarComponent } from '../avatar/avatar.component';
import { MdButtonComponent } from '../button/button.component';
import { MdElevationComponent } from '../elevation/elevation.component';
import { MdIconButtonComponent } from '../icon-button/icon-button.component';
import { MdTintComponent } from '../tint/tint.component';

@Component({
  selector: 'md-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdEmbeddedButtonComponent,
    CommonModule,
    MdElevationComponent,
    MdFocusRingComponent,
    MdTintComponent,
    MdRippleComponent,
  ],
  host: {
    '[attr.variant]': 'variant() ? variant() : null',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.interactive]': 'interactive() ? "" : null',
  },
})
export class MdCardComponent extends MdComponent {
  readonly variant = model<CardVariant>('outlined');
  readonly interactive = input(false);
  readonly href = input<string>();
  readonly target = model<string>();
  readonly disabled = input(false);
  readonly value = input<boolean | number | string>();
  readonly avatars = contentChildren(MdAvatarComponent);
  readonly iconButtons = contentChildren(MdIconButtonComponent);
  readonly buttons = contentChildren(MdButtonComponent);

  constructor() {
    super();
    effect(() => {
      for (const avatar of this.avatars()) {
        avatar.disabled.set(this.disabled());
      }
      for (const iconButton of this.iconButtons()) {
        iconButton.disabled.set(this.disabled());
      }
      for (const button of this.buttons()) {
        button.disabled.set(this.disabled());
      }
    });
  }
}
