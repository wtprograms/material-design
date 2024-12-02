import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { MdValueAccessorComponent } from '../md-value-accessor.component';
import { MdFieldUserDirective } from '../field/field-user.directive';
import { MdIconButtonComponent } from '../icon-button/icon-button.component';
import { CommonModule, DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  combineLatest,
  fromEvent,
  map,
  merge,
  skip,
  startWith,
  tap,
} from 'rxjs';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DURATION } from '../../common/motion/duration';
import { EASING } from '../../common/motion/easing';
import { openClose } from '../../common/rxjs/open-close';
import { MdButtonModule } from '../button/button.module';
import { MdDialogModule } from '../dialog/dialog.module';
import { MdFieldModule } from '../field/field.module';
import { MdIconComponent } from '../icon/icon.component';
import { MdListModule } from '../list/list.module';
import { MdPopoverComponent } from '../popover/popover.component';

export type DatePickerInputVariant = 'embedded' | 'dropdown' | 'dialog';

export type DatePickerValueType =
  | string
  | undefined
  | [string | undefined, string | undefined];

interface Day {
  day: number;
  type: string;
  date: Date;
}

@Component({
  selector: 'md-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdIconButtonComponent,
    MdButtonModule,
    MdIconComponent,
    CommonModule,
    MdListModule,
    MdFieldModule,
    MdDialogModule,
    MdPopoverComponent,
    FormsModule,
    DatePipe,
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
      useExisting: forwardRef(() => MdDatePickerComponent),
    },
  ],
})
export class MdDatePickerComponent extends MdValueAccessorComponent<DatePickerValueType> {
  readonly fieldUser = inject(MdFieldUserDirective);
  readonly range = input(false);
  readonly inputVariant = input<DatePickerInputVariant>('dropdown');
  readonly open = model(false);
  readonly selectedValue = model<DatePickerValueType>();
  readonly locale = input('en');

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

  private readonly _monthsDropdown =
    viewChild<ElementRef<HTMLElement>>('monthsDropdown');
  private readonly _yearsDropdown =
    viewChild<ElementRef<HTMLElement>>('yearsDropdown');

  readonly monthsOpen = signal(false);
  readonly monthsOpenCloseState = toSignal(
    openClose(
      toObservable(this.monthsOpen).pipe(
        skip(1),
        tap((open) => {
          if (open) {
            this.yearsOpen.set(false);
          }
        }),
        tap((open) =>
          this.animate(
            this._monthsDropdown()!.nativeElement,
            open,
            'inline-flex'
          )
        )
      )
    )
  );

  readonly yearsOpen = signal(false);
  readonly yearsOpenCloseState = toSignal(
    openClose(
      toObservable(this.yearsOpen).pipe(
        skip(1),
        tap((open) => {
          if (open) {
            this.monthsOpen.set(false);
          }
        }),
        tap((open) =>
          this.animate(this._yearsDropdown()!.nativeElement, open, 'grid')
        )
      )
    )
  );

  get fromValueAsDate() {
    const value = this.value();
    if (this.range()) {
      return value?.[0] ? new Date(value[0]) : undefined;
    } else {
      return value ? new Date(value as string) : undefined;
    }
  }
  set fromValueAsDate(date: Date | undefined) {
    if (this.range()) {
      this.value.update((value) => [date?.toUTCString(), value?.[1]]);
    } else {
      this.value.set(date?.toUTCString());
    }
    this.month.set(date?.getMonth() ?? this.today.getMonth());
    this.year.set(date?.getFullYear() ?? this.today.getFullYear());
  }

  get toValueAsDate() {
    const value = this.value();
    if (this.range()) {
      return value?.[1] ? new Date(value[1]) : undefined;
    } else {
      return value ? new Date(value as string) : undefined;
    }
  }
  set toValueAsDate(date: Date | undefined) {
    if (this.range()) {
      this.value.update((value) => [value?.[0], date?.toUTCString()]);
    } else {
      this.value.set(date?.toUTCString());
    }
    this.month.set(date?.getMonth() ?? this.today.getMonth());
    this.year.set(date?.getFullYear() ?? this.today.getFullYear());
  }

  get fromSelectedValueAsDate() {
    const selectedValue = this.selectedValue();
    if (this.range()) {
      return selectedValue?.[0] ? new Date(selectedValue[0]) : undefined;
    } else {
      return selectedValue ? new Date(selectedValue as string) : undefined;
    }
  }
  set fromSelectedValueAsDate(date: Date | undefined) {
    if (this.range()) {
      this.selectedValue.update((value) => [date?.toUTCString(), value?.[1]]);
    } else {
      this.selectedValue.set(date?.toUTCString());
    }
    this.month.set(date?.getMonth() ?? this.today.getMonth());
    this.year.set(date?.getFullYear() ?? this.today.getFullYear());
  }

  get toSelectedValueAsDate() {
    const selectedValue = this.selectedValue();
    if (this.range()) {
      return selectedValue?.[1] ? new Date(selectedValue[1]) : undefined;
    } else {
      return selectedValue ? new Date(selectedValue as string) : undefined;
    }
  }
  set toSelectedValueAsDate(date: Date | undefined) {
    if (this.range()) {
      this.selectedValue.update((value) => [value?.[0], date?.toUTCString()]);
    } else {
      this.selectedValue.set(date?.toUTCString());
    }
    this.month.set(date?.getMonth() ?? this.today.getMonth());
    this.year.set(date?.getFullYear() ?? this.today.getFullYear());
  }

  readonly months = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), { month: 'long' });
    return Array.from({ length: 12 }, (_, value) => ({
      text: formatter.format(new Date(0, value)),
      value,
    }));
  });

  readonly month = signal(this.today.getMonth());
  readonly monthText = computed(() => {
    const month = this.month();
    const date = this.fromSelectedValueAsDate ?? new Date(this.today);
    date.setMonth(month);
    const dateString = date.toLocaleDateString(this.locale(), {
      month: 'short',
    });
    return dateString;
  });

  get years() {
    const startYear = 1930;
    const endYear = 2060;
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, value) => startYear + value
    );
  }

  readonly year = signal(this.today.getFullYear());
  readonly yearText = computed(() => {
    const year = this.year();
    const date = this.fromSelectedValueAsDate ?? new Date(this.today);
    date.setFullYear(year);
    const dateString = date.toLocaleDateString(this.locale(), {
      year: 'numeric',
    });
    return dateString;
  });

  readonly dayNames = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), {
      weekday: 'narrow',
    });
    return Array.from({ length: 7 }, (_, i) =>
      formatter.format(new Date(1970, 0, i + 4))
    );
  });

  readonly days = computed(() => {
    const month = this.month();
    const year = this.year();
    const date = new Date(year, month);
    const firstDayOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      1 - firstDayOfMonth
    );
    const calendarDays: Day[] = [];

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const day = currentDate.getDate();
      let type = 'current';

      if (currentDate.getMonth() < date.getMonth()) {
        type = 'previous';
      } else if (currentDate.getMonth() > date.getMonth()) {
        type = 'next';
      }

      calendarDays.push({ day, type, date: currentDate });
    }

    return calendarDays;
  });

  get today() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  constructor() {
    super();
    effect(() => {
      this.open();
      this.month();
      this.selectedValue();
      this.value();
      this.monthsOpen.set(false);
    });
    effect(() => {
      this.open();
      this.year();
      this.selectedValue();
      this.value();
      this.yearsOpen.set(false);
    });
  }

  isDateEqual(date1: Date | undefined, date2: Date | undefined) {
    if (!date1 || !date2) {
      return false;
    }
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  isDateSelected(date: Date) {
    return (
      this.isDateEqual(this.fromSelectedValueAsDate, date) ||
      this.isDateEqual(this.toSelectedValueAsDate, date)
    );
  }

  private _isSelectingTo = false;
  select(date: Date) {
    this.month.set(date.getMonth());
    this.year.set(date.getFullYear());
    if (!this.range()) {
      this.fromSelectedValueAsDate = date;
      if (this.inputVariant() === 'embedded') {
        this.fromValueAsDate = this.fromSelectedValueAsDate;
      }
    } else {
      if (!this._isSelectingTo) {
        this.fromSelectedValueAsDate = date;
        this.toSelectedValueAsDate = undefined;
        if (this.inputVariant() === 'embedded') {
          this.fromValueAsDate = this.fromSelectedValueAsDate;
          this.toValueAsDate = this.toSelectedValueAsDate;
        }
        this._isSelectingTo = true;
      } else {
        if (date < this.fromSelectedValueAsDate!) {
          this._isSelectingTo = false;
          this.select(date);
          return;
        }
        this.toSelectedValueAsDate = date;
        if (this.inputVariant() === 'embedded') {
          this.toValueAsDate = this.toSelectedValueAsDate;
        }
        this._isSelectingTo = false;
      }
    }
  }

  todayClick() {
    this.month.set(this.today.getMonth());
    this.year.set(this.today.getFullYear());
  }

  selectMonth(index: number) {
    this.month.set(index);
    this.monthsOpen.set(false);
  }

  selectYear(index: number) {
    this.year.set(index);
    this.yearsOpen.set(false);
  }

  clear() {
    this.selectedValue.set(undefined);
    this.value.set(undefined);
  }

  cancel() {
    this.selectedValue.set(this.value());
    this.open.set(false);
  }

  okay() {
    this.value.set(this.selectedValue());
    this.open.set(false);
  }

  inRange(date: Date) {
    if (!this.fromSelectedValueAsDate || !this.toSelectedValueAsDate) {
      return false;
    }
    return (
      date >= this.fromSelectedValueAsDate && date <= this.toSelectedValueAsDate
    );
  }

  bodyClick() {
    this.open.set(true);
  }

  private getHeight(dropdown: HTMLElement) {
    dropdown.classList.add('measure');
    const height = dropdown.offsetHeight;
    dropdown.classList.remove('measure');
    return height;
  }

  private _animation?: Animation;
  private async animate(dropdown: HTMLElement, open: boolean, display: string) {
    const timings: OptionalEffectTiming = {
      easing: EASING.standardDecelerate,
      duration: DURATION.short4,
      fill: 'forwards',
    };

    if (open) {
      dropdown.style.display = display;
    }

    const height = this.getHeight(dropdown);
    const style: any = {
      opacity: ['0', '1'],
      height: ['0px', `${height}px`],
    };

    if (!open) {
      style.height = style.height.reverse();
      style.opacity = style.opacity.reverse();
      timings.easing = EASING.standardAccelerate;
      timings.duration = DURATION.short3;
    }

    this._animation = dropdown.animate(style, timings);
    try {
      await this._animation.finished;
    } catch {}
    dropdown.style.height = open ? 'auto' : '0px';
    const item = dropdown.querySelector('.current');
    item?.scrollIntoView({ block: 'center', behavior: 'smooth' });

    if (!open) {
      dropdown.style.display = 'none';
    }
  }
}
