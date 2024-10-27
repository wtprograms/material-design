import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  model,
  viewChild,
  ElementRef,
  inject,
  computed,
  HostListener,
} from '@angular/core';
import { dispatchActivationClick } from '../../common/events/dispatch-activation-click';
import { ForwardFocusDirective } from '../../directives/forward-focus.directive';
import { ElevationComponent } from '../elevation/elevation.component';
import { RippleComponent } from '../ripple/ripple.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { ButtonComponent } from '../button/button.component';
import { CheckComponent } from '../check/check.component';
import { DividerComponent } from '../divider/divider.component';
import { MaterialDesignComponent } from '../material-design.component';
import { ProgressIndicatorComponent } from '../progress-indicator/progress-indicator.component';
import { TouchAreaComponent } from '../touch-area/touch-area.component';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { SlotDirective } from '../../directives/slot.directive';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'md-list-item',
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    ProgressIndicatorComponent,
    TouchAreaComponent,
    RippleComponent,
    FocusRingComponent,
    ElevationComponent,
    CommonModule,
    SlotDirective,
    DividerComponent,
  ],
  hostDirectives: [ForwardFocusDirective],
  host: {
    '[attr.leading]': `leadingSlot()?.any() || null`,
    '[attr.trailing]': `trailingSlot()?.any() || null`,
    '[attr.supportingText]': `supportingTextSlot()?.any() || null`,
    '[attr.top]': 'top() || null',
    '[attr.large]': 'large() || null',
    '[attr.selected]': 'selected() || null',
    '[attr.disabled]': 'disabled() || null',
    '[attr.split]': 'split()',
    '[attr.busy]': 'progressIndeterminate() || !!progressValue() || null',
    '[attr.interactive]': 'interactive() ?? null',
  },
})
export class ListItemComponent extends MaterialDesignComponent {
  readonly dragging = model(false);
  readonly top = model(false);
  readonly large = model(false);
  readonly selected = model(false);
  readonly split = model(false);
  readonly disabled = model(false);
  readonly href = model<string>();
  readonly anchorTarget = model<string>();
  readonly name = model<string>();
  readonly value = model<string>();
  readonly progressIndeterminate = model(false);
  readonly progressValue = model(0);
  readonly progressMax = model(0);
  readonly progressBuffer = model(0);
  readonly interactive = model(true);

  readonly leadingSlot = this.slotDirective('leading');
  readonly trailingSlot = this.slotDirective('trailing');
  readonly supportingTextSlot = this.slotDirective('supporting-text');

  readonly button =
    viewChild<ElementRef<HTMLButtonElement | HTMLAnchorElement>>('button');

  private readonly _dropdownField = inject(DropdownComponent, {
    optional: true,
  });

  constructor() {
    super();
    this.setSlots<AvatarComponent | IconComponent>(
      [AvatarComponent, IconComponent],
      (x) => (x.hostElement.slot = 'leading')
    );
    this.setSlots(CheckComponent, (x) => (x.hostElement.slot = 'trailing'));
  }

  @HostListener('click')
  onClick() {
    if (this._dropdownField) {
      this._dropdownField.value.set(this.value());
    }
    this.hostElement.dispatchEvent(
      new Event('close-popover', { bubbles: true })
    );
    if (this.split() || !this.interactive) {
      return;
    }
    const allSlottedComponents = [
      ...(this.leadingSlot()?.componentsOf(AvatarComponent) || []),
      ...(this.trailingSlot()?.componentsOf<ButtonComponent | CheckComponent>(
        ButtonComponent,
        CheckComponent
      ) || []),
    ];
    for (const component of allSlottedComponents) {
      dispatchActivationClick(component.hostElement);
    }
  }
}
