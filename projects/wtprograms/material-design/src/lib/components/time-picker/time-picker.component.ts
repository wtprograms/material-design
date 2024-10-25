import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  model,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';
import { FieldComponent, FieldVariant } from '../field/field.component';
import { DialogComponent } from '../dialog/dialog.component';
import { TimeSpan } from '../../common/time-span';
import { OpenCloseState } from '../../common/rxjs/open-close';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { RippleComponent } from '../ripple/ripple.component';
import { getMeridianValues } from '../../common/date-helpers/get-meridian-values';

export type TimePickerVariant = 'embedded' | 'dropdown' | 'dialog';

@Component({
  selector: 'md-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    ButtonComponent,
    DialogComponent,
    FieldComponent,
    CommonModule,
    IconComponent,
    FormsModule,
    RippleComponent,
  ],
  hostDirectives: [],
  host: {},
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TimePickerComponent),
    },
  ],
})
export class TimePickerComponent extends MaterialDesignValueAccessorComponent<
  string | undefined
> {
  readonly variant = model<TimePickerVariant>('embedded');
  readonly fieldVariant = model<FieldVariant>('filled');
  readonly label = model<string>();
  override readonly value = model<string | undefined>();
  readonly selectionValue = model<string | undefined>(this.value());
  readonly field = viewChild<FieldComponent<string | undefined>>('field');
  readonly dialog = viewChild<DialogComponent>('dialog');
  readonly hours = model(true);
  readonly seconds = model(false);
  readonly timeOfDay = model(false);
  readonly locale = model('en');
  readonly meridian = model('am');

  readonly populated = computed(() => {
    if (this.field()?.popover()?.state() === 'closing' && !this.value()) {
      return false;
    }
    return (
      !!this.value() ||
      this.field()?.open() ||
      this.field()?.popover()?.state() === 'opening'
    );
  });

  get meridianLabels() {
    return getMeridianValues(this.locale());
  }

  get valueAsTimeSpan() {
    return this.value() ? TimeSpan.parse(this.value()!) : undefined;
  }
  set valueAsTimeSpan(value: TimeSpan | undefined) {
    this.value.set(value?.toString());
  }

  get selectedValueAsTimeSpan() {
    return this.selectionValue()
      ? TimeSpan.parse(this.selectionValue()!)
      : undefined;
  }
  set selectedValueAsTimeSpan(value: TimeSpan | undefined) {
    this.selectionValue.set(value?.toString());
  }

  readonly hoursInput = signal(this.selectedValueAsTimeSpan?.hours);
  readonly minutesInput = signal(this.selectedValueAsTimeSpan?.minutes);
  readonly secondsInput = signal(this.selectedValueAsTimeSpan?.seconds);

  readonly displayText = computed(() => {
    if (!this.valueAsTimeSpan) {
      return $localize`Select a time...`;
    }
    const time = this.valueAsTimeSpan.toString({
      seconds: this.seconds(),
      hours: this.hours(),
    });
    if (this.timeOfDay()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return `${time} ${(this.meridianLabels as any)[this.meridian()]}`;
    }
    return time;
  });

  constructor() {
    super();
    effect(
      () => {
        const hours = this.hoursInput();
        const minutes = this.minutesInput();
        const seconds = this.secondsInput();
        this.selectedValueAsTimeSpan = new TimeSpan(hours, minutes, seconds);
      },
      {
        allowSignalWrites: true,
      }
    );
    effect(
      () => {
        if (this.variant() === 'embedded') {
          this.value.set(this.selectionValue());
        }
      },
      {
        allowSignalWrites: true,
      }
    );
    effect(
      () => {
        if (this.timeOfDay()) {
          if (this.meridian() === 'am' && this.hoursInput() === 12) {
            this.hoursInput.set(0);
          } else if (this.meridian() === 'pm' && this.hoursInput() === 0) {
            this.hoursInput.set(12);
          }
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  clearClick() {
    this.value.set(undefined);
    this.selectionValue.set(undefined);
  }

  okayClick() {
    this.value.set(this.selectionValue());
    if (this.variant() === 'dropdown') {
      this.field()?.open.set(false);
    }
    if (this.variant() === 'dialog') {
      this.dialog()?.open.set(false);
    }
  }

  cancelClick() {
    this.selectionValue.set(this.value());
    if (this.variant() === 'dropdown') {
      this.field()?.open.set(false);
    }
    if (this.variant() === 'dialog') {
      this.dialog()?.open.set(false);
    }
  }

  bodyClick() {
    if (this.variant() !== 'dialog') {
      return;
    }
    this.dialog()?.open.set(true);
  }

  popoverStateChange(state: OpenCloseState) {
    if (state === 'closed') {
      this.cancelClick();
    }
  }

  onBeforeInput(event: Event, part: 'hours' | 'minutes' | 'seconds') {
    const input = event.target as HTMLInputElement;
    const inputEvent = event as InputEvent;
    if (inputEvent.inputType === 'insertText') {
      inputEvent.preventDefault();
      const min = 0;
      const max = part === 'hours' ? 12 : 59;
      let value = parseInt(input.value + (inputEvent.data ?? '0'));

      if (this.timeOfDay() || part !== 'hours') {
        if (value < min) {
          value = min;
        }
        if (value > max) {
          value = max;
        }
      }

      if (part === 'hours') {
        if (this.timeOfDay() && this.meridian() === 'am' && value === 12) {
          this.hoursInput.set(0);
        } else if (
          this.timeOfDay() &&
          this.meridian() === 'pm' &&
          value === 0
        ) {
          this.hoursInput.set(12);
        } else {
          this.hoursInput.set(value);
        }
      }

      if (part === 'minutes') {
        this.minutesInput.set(value);
      }

      if (part === 'seconds') {
        this.secondsInput.set(value);
      }
    }
  }
}
