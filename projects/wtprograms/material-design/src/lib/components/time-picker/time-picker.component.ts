import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { MdFieldModule } from '../field/field.module';
import { FormsModule } from '@angular/forms';
import { MdButtonComponent } from '../button/button.component';
import { MdFieldTrailingDirective } from '../field/field-trailing.directive';
import { FieldVariant } from '../field/field-variant';
import { MdIconComponent } from '../icon/icon.component';
import { MdTintComponent } from '../tint/tint.component';
import { Time } from './time';
import { MdDialogModule } from '../dialog/dialog.module';
import { TimePickerLayout } from './time-picker-layout';
import { MdValueAccessorComponent } from '../../common/base/value-accessor/md-value-accessor.component';

@Component({
  selector: 'md-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdFieldModule,
    CommonModule,
    FormsModule,
    MdIconComponent,
    MdDialogModule,
    MdButtonComponent,
    MdTintComponent,
  ],
})
export class MdTimePickerComponent extends MdValueAccessorComponent<number> {
  readonly variant = input<FieldVariant>('filled');
  readonly layout = input<TimePickerLayout>('field');
  readonly stateText = model<string>();
  readonly label = input<string>();
  readonly prefixText = input<string>();
  readonly suffixText = input<string>();
  readonly selectedValue = model<number>();
  readonly open = model(false);
  readonly min = input<number>();
  readonly max = input<number>();
  readonly locale = input('en');
  readonly trailing = contentChild(MdFieldTrailingDirective);
  readonly displayHours = input(true);
  readonly displaySeconds = input(false);
  readonly timeOfDay = input(false);

  readonly populated = computed(() => !!this.value() || this.open());

  readonly displayText = computed(() => {
    const time = this.valueAsTime;
    if (!time) {
      return undefined;
    }
    const parts: string[] = [];
    if (this.displayHours()) {
      parts.push(time.hours.toString().padStart(2, '0'));
    }
    parts.push(time.minutes.toString().padStart(2, '0'));
    if (this.displaySeconds()) {
      parts.push(time.seconds.toString().padStart(2, '0'));
    }
    let value = parts.join(':');
    return value;
  });

  readonly meridianValues = computed(() => {
    const date = new Date(2000, 0, 1);
    const am = date
      .toLocaleTimeString(this.locale(), { hour: 'numeric', hour12: true })
      .split(' ')[1];
    date.setHours(13);
    const pm = date
      .toLocaleTimeString(this.locale(), { hour: 'numeric', hour12: true })
      .split(' ')[1];
    return [am, pm];
  });

  get valueAsTime() {
    if (!this.value()) {
      return undefined;
    }
    return Time.fromTotalSeconds(this.value()!);
  }
  set valueAsTime(time: Time | undefined) {
    this.value.set(time?.totalSeconds);
  }

  get selectedValueAsTime() {
    if (!this.selectedValue()) {
      return undefined;
    }
    return Time.fromTotalSeconds(this.selectedValue()!);
  }
  set selectedValueAsTime(time: Time | undefined) {
    this.selectedValue.set(time?.totalSeconds);
  }

  bodyClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
      return;
    }
    this.open.set(true);
  }

  beforeInput(event: Event, part: 'hours' | 'minutes' | 'seconds') {
    const input = event.target as HTMLInputElement;
    const inputEvent = event as InputEvent;
    if (inputEvent.inputType === 'insertText') {
      inputEvent.preventDefault();
      let min = 0;
      let max = 59;
      let value = Number(input.value + (inputEvent.data ?? '0'));

      if (part !== 'hours') {
        value = Math.max(min, Math.min(max, value));
      } else {
        if (this.timeOfDay()) {
          value = Math.max(min, Math.min(23, value));
        } else {
          value = Math.max(min, value);
        }
      }

      const time = this.selectedValueAsTime ?? new Time();
      let hours = time.hours;
      let minutes = time.minutes;
      let seconds = time.seconds;
      switch (part) {
        case 'hours':
          hours = value;
          break;
        case 'minutes':
          minutes = value;
          break;
        case 'seconds':
          seconds = value;
          break;
      }
      let totalSeconds = new Time(hours, minutes, seconds).totalSeconds;
      if (this.min() !== undefined) {
        totalSeconds = Math.max(this.min()!, totalSeconds);
      }
      if (this.max() !== undefined) {
        totalSeconds = Math.min(this.max()!, totalSeconds);
      }
      ({ hours, minutes, seconds } = Time.fromTotalSeconds(totalSeconds));
      this.selectedValue.set(new Time(hours, minutes, seconds).totalSeconds);
    }
  }

  okay() {
    this.value.set(this.selectedValue());
    this.open.set(false);
  }

  cancel() {
    this.selectedValue.set(this.value());
    this.open.set(false);
  }

  reset() {
    this.value.set(undefined);
    this.selectedValue.set(undefined);
    this.open.set(false);
  }
}
