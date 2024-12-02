import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  model,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdIconComponent } from '../icon/icon.component';
import { MdValueAccessorComponent } from '../md-value-accessor.component';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.component';
import { MdRippleComponent } from '../ripple/ripple.component';
import { isActivationClick } from '../../common/events/is-activation-click';
import { dispatchActivationClick } from '../../common/events/dispatch-activation-click';

export type CheckType = 'checkbox' | 'radio';

@Component({
  selector: 'md-check',
  templateUrl: './check.component.html',
  styleUrl: './check.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MdRippleComponent,
    MdFocusRingComponent,
    FormsModule,
    MdIconComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdCheckComponent),
    },
  ],
  host: {
    '[class.switch]': 'switch()',
    '[class.disabled]': 'disabled()',
    '(click)': 'click($event)',
  },
})
export class MdCheckComponent extends MdValueAccessorComponent<
  string | boolean
> {
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly switch = input(false);
  readonly type = input<CheckType>('checkbox');

  readonly checkedIcon = computed(() =>
    this.type() === 'checkbox' ? 'check_box' : 'radio_button_checked'
  );

  readonly indeterminateIcon = computed(() =>
    this.type() === 'checkbox'
      ? 'indeterminate_check_box'
      : 'radio_button_unchecked'
  );

  readonly uncheckedIcon = computed(() =>
    this.type() === 'checkbox'
      ? 'check_box_outline_blank'
      : 'radio_button_unchecked'
  );

  private readonly _inputElement =
    viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  input(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.checked.set(!!input.checked);
    this.indeterminate.set(!!input.indeterminate);
  }

  click(event: Event) {
    if (this.disabled()) {
      return;
    }
    if (!isActivationClick(event)) {
      return;
    }

    dispatchActivationClick(this._inputElement().nativeElement, false);
  }
}
