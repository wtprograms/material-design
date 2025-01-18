import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  model,
  viewChild,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.module';
import { MdRippleComponent } from '../ripple/ripple.module';
import { CheckType } from './check-type';
import { MdValueAccessorComponent } from '../../common/base/value-accessor/md-value-accessor.component';
import { dispatchActivationClick } from '../../common/events/dispatch-activation-click';
import { isActivationClick } from '../../common/events/is-activation-click';
import { MdIconComponent } from '../icon/icon.component';
import { MdTintComponent } from '../tint/tint.component';

@Component({
  selector: 'md-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MdIconComponent,
    MdFocusRingComponent,
    MdTintComponent,
    MdRippleComponent,
  ],
  host: {
    '[attr.switch]': 'switch() ? "" : null',
    '[attr.type]': 'type()',
    '(click)': 'click($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdCheckComponent),
    },
  ],
})
export class MdCheckComponent extends MdValueAccessorComponent<
  string | boolean | number
> {
  readonly type = input<CheckType>('checkbox');
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly switch = input(false);
  readonly radioValue = input<string | boolean | number>();
  private readonly _input =
    viewChild.required<ElementRef<HTMLInputElement>>('input');

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

  constructor() {
    super();
    effect(() => {
      const type = this.type();
      const value = this.value();
      const radioValue = this.radioValue();
      const checked = this.checked();
      if (type === 'radio') {
        this.checked.set(value === radioValue);
      } else {
        this.value.set(checked);
      }
    });
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.type() === 'radio') {
      this.value.set(this.radioValue());
    } else {
      this.checked.set(input.checked);
      this.indeterminate.set(input.indeterminate);
    }
  }

  click(event: Event) {
    if (this.disabled()) {
      return;
    }
    if (!isActivationClick(event)) {
      return;
    }

    dispatchActivationClick(this._input()?.nativeElement!, false);
  }
}
