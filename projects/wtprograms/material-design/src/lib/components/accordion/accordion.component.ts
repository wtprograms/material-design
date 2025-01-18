import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import {
  MdEmbeddedButtonComponent,
} from '../embedded-button/embedded-button.module';
import { MdRippleComponent } from '../ripple/ripple.module';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.module';
import { MdIconComponent } from '../icon/icon.component';
import { MdTintComponent } from '../tint/tint.component';

@Component({
  selector: 'md-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdEmbeddedButtonComponent,
    MdRippleComponent,
    MdFocusRingComponent,
    MdTintComponent,
    MdIconComponent,
  ],
  host: {
    '[attr.open]': 'open() ? "" : null',
  },
})
export class MdAccordionComponent {
  readonly open = model(false);
}
