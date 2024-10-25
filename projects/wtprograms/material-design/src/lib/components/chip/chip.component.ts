import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  model,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { SlotDirective } from '../../directives/slot.directive';
import { RippleComponent } from '../ripple/ripple.component';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { TouchAreaComponent } from '../touch-area/touch-area.component';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../avatar/avatar.component';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'md-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    SlotDirective,
    RippleComponent,
    FocusRingComponent,
    TouchAreaComponent,
    CommonModule,
    ButtonComponent,
    IconComponent,
  ],
  hostDirectives: [],
  host: {
    '[attr.leading]': `leadingSlot()?.any() || null`,
    '[attr.trailing]': `trailingSlot()?.any() || null`,
    '[attr.disabled]': 'disabled() || null',
    '[attr.closable]': 'closable() || null',
    '[attr.pill]': 'pill() || null',
    '[attr.selected]': 'selected() || null',
  },
})
export class ChipComponent extends MaterialDesignComponent {
  readonly closable = model(false);
  readonly pill = model(false);
  readonly disabled = model(false);
  readonly selected = model(false);
  readonly href = model<string>();
  readonly anchorTarget = model<string>();
  readonly name = model<string>();
  readonly value = model<string>();
  readonly close = output();

  readonly leadingSlot = this.slotDirective('leading');
  readonly trailingSlot = this.slotDirective('trailing');

  readonly button =
    viewChild<ElementRef<HTMLButtonElement | HTMLAnchorElement>>('button');

  constructor() {
    super();
    this.setSlots(AvatarComponent, (x) => (x.hostElement.slot = 'leading'));
  }
}
