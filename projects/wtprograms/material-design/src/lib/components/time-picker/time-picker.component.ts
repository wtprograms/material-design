import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdValueAccessorComponent } from '../md-value-accessor.component';
import { MdFieldUserDirective } from '../field/field-user.directive';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, fromEvent, map, merge, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MdButtonModule } from '../button/button.module';
import { MdDialogModule } from '../dialog/dialog.module';
import { MdFieldModule } from '../field/field.module';
import { MdIconComponent } from '../icon/icon.component';
import { MdListModule } from '../list/list.module';
import { MdPopoverComponent } from '../popover/popover.component';

export type TimePickerInputVariant = 'embedded' | 'dropdown' | 'dialog';

export class Time {
  get totalSeconds() {
    return this.hours * 3600 + this.minutes * 60 + this.seconds;
  }

  constructor(
    public readonly hours = 0,
    public readonly minutes = 0,
    public readonly seconds = 0,
  ) {}

  static fromTotalSeconds(totalSeconds: number) {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      seconds = totalSeconds % 60;
    }
    if (minutes >= 60) {
      hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
    }
    return new Time(hours, minutes, seconds);
  }
}

@Component({
  selector: 'md-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdButtonModule,
    MdIconComponent,
    CommonModule,
    MdListModule,
    MdFieldModule,
    MdDialogModule,
    MdPopoverComponent,
    FormsModule,
  ],
  hostDirectives: [
    {
      directive: MdFieldUserDirective,
      inputs: ['variant', 'label', 'prefix', 'suffix', 'supportingText'],
    },
  ],
  host: {
    '[class]': 'inputVariant()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdTimePickerComponent),
    },
  ],
})
export class MdTimePickerComponent extends MdValueAccessorComponent<number> {
  readonly fieldUser = inject(MdFieldUserDirective);
  readonly inputVariant = input<TimePickerInputVariant>('dropdown');
  readonly open = model(false);
  readonly selectedValue = model<number | undefined>(this.value());
  readonly locale = input('en');
  readonly displayHours = input(true);
  readonly displaySeconds = input(false);
  readonly timeOfDay = input(false);

  readonly time = computed(() => Time.fromTotalSeconds(this.value() ?? 0));
  readonly selectedTime = computed(() =>
    Time.fromTotalSeconds(this.selectedValue() ?? 0)
  );
  readonly displayText = computed(() => {
    const time = this.time();
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

  readonly populated = toSignal(
    combineLatest({
      focused: merge(
        fromEvent(this.hostElement, 'focus').pipe(
          map(() => true),
          startWith(false)
        ),
        fromEvent(this.hostElement, 'blur').pipe(
          map(() => false),
          startWith(false)
        )
      ),
      value: toObservable(this.value),
      open: toObservable(this.open),
    }).pipe(map(({ focused, value, open }) => focused || !!value || open)),
    {
      initialValue: false,
    }
  );

  clear() {
    this.value.set(undefined);
    this.selectedValue.set(undefined);
  }

  okay() {
    this.value.set(this.selectedValue());
    this.open.set(false);
  }

  cancel() {
    this.selectedValue.set(this.value());
    this.open.set(false);
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

      const time = this.selectedTime();
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
      this.selectedValue.set(
        new Time(hours, minutes, seconds).totalSeconds
      );
    }
  }
}
