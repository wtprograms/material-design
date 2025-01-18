import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  input,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdComponent } from '../../common/base/md.component';
import { MdFabLabelComponent } from './fab-label/fab-label.component';
import { FabSize } from './fab-size';
import { MdElevationComponent } from '../elevation/elevation.component';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.component';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.component';
import { MdRippleComponent } from '../ripple/ripple.component';
import { MdTintComponent } from '../tint/tint.component';

@Component({
  selector: 'md-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
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
    '[attr.size]': 'size()',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.lowered]': 'lowered() ? "" : null',
    '[attr.extended]': 'extended() ? "" : null',
  },
})
export class MdFabComponent extends MdComponent {
  readonly size = input<FabSize>('medium');
  readonly embedded = input(false);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly disabled = model(false);
  readonly extended = model(false);
  readonly lowered = input(false);
  readonly elevationLevel = computed(() => (this.lowered() ? 1 : 3));
  readonly label = contentChild(MdFabLabelComponent);

  constructor() {
    super();
    effect(() => {
      const label = this.label();
      const extended = this.extended();
      if (label) {
        label.extended.set(extended);
      }
    });
  }
}
