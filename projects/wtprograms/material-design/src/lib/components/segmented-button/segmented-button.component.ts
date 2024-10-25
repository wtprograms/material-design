import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  model,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { attachTarget } from '../../directives/attachable.directive';
import { ForwardFocusDirective } from '../../directives/forward-focus.directive';
import { ParentActivationDirective } from '../../directives/parent-activation.directive';
import { BadgeComponent } from '../badge/badge.component';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { IconComponent } from '../icon/icon.component';
import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';
import { RippleComponent } from '../ripple/ripple.component';
import { TouchAreaComponent } from '../touch-area/touch-area.component';

export type SegmentedButtonType = 'button' | 'checkbox' | 'radio';

@Component({
  selector: 'md-segmented-button',
  templateUrl: './segmented-button.component.html',
  styleUrl: './segmented-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: true,
  imports: [
    TouchAreaComponent,
    RippleComponent,
    FocusRingComponent,
    CommonModule,

    BadgeComponent,
    IconComponent,
  ],
  hostDirectives: [ParentActivationDirective, ForwardFocusDirective],
  host: {
    '[attr.disabled]': 'disabled() || null',
    '[attr.selected]': 'selectedOrChecked() || null',
    '[attr.leading]':
      'leadingSlot()?.any() || selectedOrChecked() && checkOnSelected() || null',
    '[attr.trailing]':
      'trailingSlot()?.any() || badgeDot() || !!badgeNumber() || null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SegmentedButtonComponent),
    },
  ],
})
export class SegmentedButtonComponent extends MaterialDesignValueAccessorComponent<boolean> {
  readonly selected = model(false);
  readonly type = model<SegmentedButtonType>('button');
  readonly name = model<string>();
  override readonly value = model<boolean | undefined>();
  readonly badgeDot = model(false);
  readonly badgeNumber = model<number>();
  readonly checkOnSelected = model(false);
  readonly checked = computed(() => this.value() === true);
  readonly selectedOrChecked = computed(
    () => this.selected() || this.checked()
  );

  readonly leadingSlot = this.slotDirective('leading');
  readonly trailingSlot = this.slotDirective('trailing');

  private readonly _button = viewChild<ElementRef<HTMLButtonElement>>('button');
  private readonly _input = viewChild<ElementRef<HTMLInputElement>>('input');
  readonly input = computed(() =>
    this.type() === 'button' ? this._button() : this._input()
  );

  constructor() {
    super();
    attachTarget(ForwardFocusDirective, this.input);
    attachTarget(ParentActivationDirective, this.input);
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.checked);
  }
}
