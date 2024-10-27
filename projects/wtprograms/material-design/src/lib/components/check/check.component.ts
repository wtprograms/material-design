import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  model,
  viewChild,
  ElementRef,
  computed,
  signal,
  effect,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { attachTarget } from '../../directives/attachable.directive';
import { ForwardFocusDirective } from '../../directives/forward-focus.directive';
import { ParentActivationDirective } from '../../directives/parent-activation.directive';
import { RippleComponent } from '../ripple/ripple.component';
import { IconComponent } from '../icon/icon.component';
import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { SlotDirective } from '../../directives/slot.directive';

export type CheckType = 'checkbox' | 'radio';

@Component({
  selector: 'md-check',
  templateUrl: './check.component.html',
  styleUrl: './check.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [RippleComponent, FocusRingComponent, IconComponent, SlotDirective],
  hostDirectives: [ParentActivationDirective, ForwardFocusDirective],
  host: {
    '[attr.error]': '!!errorText() || null',
    '[attr.type]': 'type()',
    '[attr.checked]': 'checked() || indeterminate()',
    '[attr.disabled]': 'disabled() || null',
    '[attr.switch]': 'switch() || null',
    '[attr.uncheckedIcon]': `uncheckedIconSlot()?.any() || null`,
    '[attr.checkedIcon]': `checkedIconSlot()?.any() || null`,
    '[attr.label]': `labelSlot()?.any() || null`,
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckComponent),
    },
  ],
})
export class CheckComponent extends MaterialDesignValueAccessorComponent<
  boolean | undefined | string
> {
  readonly type = model<CheckType>('checkbox');
  readonly switch = model(false);
  readonly supportingText = model<string>();
  override readonly value = model<boolean | undefined | string>(false);
  readonly radioValue = model<string | undefined>();

  private readonly _input = viewChild<ElementRef<HTMLInputElement>>('input');

  readonly uncheckedIconSlot = this.slotDirective('unchecked-icon');
  readonly checkedIconSlot = this.slotDirective('checked-icon');
  readonly labelSlot = this.slotDirective();

  readonly checked = signal(false);
  readonly indeterminate = computed(() => this.value() === undefined);
  private readonly _checkboxIcon = computed(() => {
    if (!this.checked() && !this.indeterminate()) {
      return 'check_box_outline_blank';
    } else if (this.checked() && !this.indeterminate()) {
      return 'check_box';
    }
    return 'indeterminate_check_box';
  });
  private readonly _radioIcon = computed(() =>
    this.checked() ? 'radio_button_checked' : 'radio_button_unchecked'
  );
  readonly icon = computed(() =>
    this.type() === 'checkbox' ? this._checkboxIcon() : this._radioIcon()
  );

  constructor() {
    super();
    attachTarget(ParentActivationDirective, this._input);
    attachTarget(ForwardFocusDirective, this._input);
    effect(
      () => {
        if (this.type() === 'radio') {
          this.checked.set(this.value() === this.radioValue());
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;

    if (this.type() === 'radio') {
      this.checked.set(target.checked);
      this.value.set(this.radioValue());
      return;
    }

    this.checked.set(target.checked || target.indeterminate);
    if (!target.checked) {
      this.value.set(false);
    } else if (target.indeterminate) {
      this.value.set(undefined);
    } else {
      this.value.set(true);
    }
  }
}
