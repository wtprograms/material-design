import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.module';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.module';
import { MdRippleComponent } from '../ripple/ripple.module';
import { MdComponent } from '../../common/base/md.component';
import { MdTintComponent } from '../tint/tint.component';

@Component({
  selector: 'md-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MdEmbeddedButtonComponent,
    MdFocusRingComponent,
    MdTintComponent,
    MdRippleComponent,
  ],
  host: {
    '[attr.disabled]': 'disabled() ? "" : null',
  },
})
export class MdAvatarComponent extends MdComponent {
  readonly name = input.required<string>();
  readonly interactive = input(false);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly disabled = model(false);
  readonly src = input<string>();
  readonly value = input<boolean | number | string>();
  readonly initials = computed(() => this.name()[0].toUpperCase());
}
