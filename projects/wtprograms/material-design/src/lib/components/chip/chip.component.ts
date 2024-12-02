import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.component';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.component';
import { MdComponent } from '../md.component';
import { MdRippleComponent } from '../ripple/ripple.component';
import { MdIconButtonComponent } from '../icon-button/icon-button.component';
import { MdIconComponent } from '../icon/icon.component';

@Component({
  selector: 'md-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdRippleComponent,
    MdFocusRingComponent,
    MdIconButtonComponent,
    MdIconComponent,
    CommonModule,
    MdEmbeddedButtonComponent,
  ],
  host: {
    '[class.pill]': 'pill()',
    '[class.selected]': 'selected()',
    '[class.disabled]': 'disabled()'
  },
})
export class MdChipComponent extends MdComponent {
  readonly closable = model(false);
  readonly selected = input(false);
  readonly pill = input(false);
  readonly close = output<Event>();
  readonly disabled = input(false);
  readonly interactive = model(false);
  readonly value = input<unknown>();
}
