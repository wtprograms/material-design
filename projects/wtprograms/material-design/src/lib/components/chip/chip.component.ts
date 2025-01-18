import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  input,
  model,
  output,
} from '@angular/core';
import { MdComponent } from '../../common/base/md.component';
import { CommonModule } from '@angular/common';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.module';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.module';
import { MdRippleComponent } from '../ripple/ripple.module';
import { MdAvatarComponent } from '../avatar/avatar.component';
import { MdElevationComponent } from '../elevation/elevation.component';
import { MdIconButtonComponent } from '../icon-button/icon-button.component';
import { MdTintComponent } from '../tint/tint.component';

@Component({
  selector: 'md-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdEmbeddedButtonComponent,
    MdIconButtonComponent,
    CommonModule,
    MdElevationComponent,
    MdFocusRingComponent,
    MdTintComponent,
    MdRippleComponent,
  ],
  host: {
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.selected]': 'selected() ? "" : null',
    '[attr.elevated]': 'elevated() ? "" : null',
    '[attr.pill]': 'pill() ? "" : null',
  },
})
export class MdChipComponent extends MdComponent {
  readonly interactive = input(false);
  readonly href = input<string>();
  readonly target = model<string>();
  readonly disabled = input(false);
  readonly src = input<string>();
  readonly closable = model(false);
  readonly close = output<Event>();
  readonly elevated = input(false);
  readonly selected = model(false);
  readonly pill = input(false);
  readonly value = input<boolean | number | string>();

  readonly avatar = contentChild(MdAvatarComponent);

  constructor() {
    super();
    effect(() => {
      this.avatar()?.disabled?.set(this.disabled());
    });
  }
}
