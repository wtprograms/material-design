import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  model,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { ForwardFocusDirective } from '../../directives/forward-focus.directive';
import { ProgressIndicatorComponent } from '../progress-indicator/progress-indicator.component';
import { TouchAreaComponent } from '../touch-area/touch-area.component';
import { RippleComponent } from '../ripple/ripple.component';
import { CommonModule } from '@angular/common';
import { ParentActivationDirective } from '../../directives/parent-activation.directive';
import { FormSubmitterType } from '../../common/forms/form-submitted-type';
import { attachTarget } from '../../directives/attachable.directive';
import { ElevationComponent } from '../elevation/elevation.component';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { SlotDirective } from '../../directives/slot.directive';

export type ButtonVariant =
  | 'elevated'
  | 'filled'
  | 'tonal'
  | 'outlined'
  | 'text'
  | 'plain';

@Component({
  selector: 'md-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: true,
  imports: [
    ProgressIndicatorComponent,
    TouchAreaComponent,
    ElevationComponent,
    RippleComponent,
    FocusRingComponent,
    CommonModule,
    SlotDirective,
  ],
  hostDirectives: [ParentActivationDirective, ForwardFocusDirective],
  host: {
    '[attr.variant]': 'variant()',
    '[attr.disabled]': 'disabled() || null',
    '[attr.busy]': 'progressIndeterminate() || !!progressValue() || null',
    '[attr.leading]': `leadingSlot()?.any() || null`,
    '[attr.trailing]': `trailingSlot()?.any() || null`,
  },
})
export class ButtonComponent extends MaterialDesignComponent {
  readonly variant = model<ButtonVariant>('filled');
  readonly disabled = model(false);
  readonly type = model<FormSubmitterType>('button');
  readonly href = model<string>();
  readonly anchorTarget = model<string>();
  readonly name = model<string>();
  readonly value = model<string>();
  readonly progressIndeterminate = model(false);
  readonly progressValue = model(0);
  readonly progressMax = model(0);

  readonly button =
    viewChild<ElementRef<HTMLButtonElement | HTMLAnchorElement>>('button');

  readonly leadingSlot = this.slotDirective('leading');
  readonly trailingSlot = this.slotDirective('trailing');

  readonly hasElevation = computed(
    () =>
      (this.variant() === 'elevated' ||
        this.variant() === 'filled' ||
        this.variant() === 'tonal') &&
      !this.progressIndeterminate() &&
      !this.progressValue()
  );
  readonly elevationLevel = computed(() =>
    !this.disabled() && this.variant() === 'elevated' ? 1 : 0
  );

  constructor() {
    super();
    attachTarget(ForwardFocusDirective, this.button);
    attachTarget(ParentActivationDirective, this.button);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const button = this.button()?.nativeElement;
    if (!(button instanceof HTMLButtonElement) || this.href()) {
      return;
    }

    this.hostElement.closest('form')?.requestSubmit();
  }
}
