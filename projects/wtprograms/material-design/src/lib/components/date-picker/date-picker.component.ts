import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  forwardRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter, tap, delay } from 'rxjs';
import { MdFieldModule } from '../field/field.module';
import { MdListModule } from '../list/list.module';
import { DatePickerLayout } from './date-picker-layout';
import { MdButtonComponent } from '../button/button.component';
import { MdFieldTrailingDirective } from '../field/field-trailing.directive';
import { FieldVariant } from '../field/field-variant';
import { MdIconButtonComponent } from '../icon-button/icon-button.component';
import { MdIconComponent } from '../icon/icon.component';
import { MdListComponent } from '../list/list.component';
import { MdTooltipComponent } from '../tooltip/tooltip.component';
import { MdDialogModule } from '../dialog/dialog.module';
import { MdValueAccessorComponent } from '../../common/base/value-accessor/md-value-accessor.component';
import { durationToMilliseconds } from '../../common/motion';

interface Day {
  day: number;
  type: string;
  date: Date;
}

const NOW = new Date();
const TODAY = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate());

@Component({
  selector: 'md-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MdFieldModule,
    MdListModule,
    MdIconButtonComponent,
    MdButtonComponent,
    MdTooltipComponent,
    MdDialogModule,
    MdIconComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdDatePickerComponent),
    },
  ],
})
export class MdDatePickerComponent extends MdValueAccessorComponent<string> {
  readonly variant = input<FieldVariant>('filled');
  readonly layout = input<DatePickerLayout>('field');
  readonly stateText = model<string>();
  readonly label = input<string>();
  readonly prefixText = input<string>();
  readonly suffixText = input<string>();
  readonly selectedValue = model<string>();
  readonly open = model(false);
  readonly locale = input('en');
  readonly today = TODAY;
  readonly min = input<string>();
  readonly max = input<string>();

  readonly trailing = contentChild(MdFieldTrailingDirective);

  readonly populated = computed(() => !!this.value() || this.open());

  readonly monthsList = viewChild<MdListComponent>('monthsList');
  readonly yearsList = viewChild<MdListComponent>('yearsList');

  get valueAsDate() {
    return this.value() ? new Date(this.value()!) : undefined;
  }
  set valueAsDate(date: Date | undefined) {
    this.value.set(date?.toISOString() ?? undefined);
  }

  get selectedValueAsDate() {
    return this.selectedValue() ? new Date(this.selectedValue()!) : undefined;
  }
  set selectedValueAsDate(date: Date | undefined) {
    this.selectedValue.set(date?.toISOString() ?? undefined);
  }

  get minAsDate() {
    return this.min() ? new Date(this.min()!) : undefined;
  }

  get maxAsDate() {
    return this.max() ? new Date(this.max()!) : undefined;
  }

  readonly months = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), { month: 'long' });
    return Array.from({ length: 12 }, (_, value) => ({
      text: formatter.format(new Date(0, value)),
      value,
    }));
  });

  readonly month = signal(TODAY.getMonth());
  readonly monthText = computed(() => {
    const month = this.month();
    const date = this.selectedValueAsDate ?? new Date(TODAY);
    date.setMonth(month);
    const dateString = date.toLocaleDateString(this.locale(), {
      month: 'short',
    });
    return dateString;
  });
  readonly monthsOpen = signal(false);

  get years() {
    const startYear = 1930;
    const endYear = 2060;
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, value) => startYear + value
    );
  }

  readonly year = signal(TODAY.getFullYear());
  readonly yearText = computed(() => {
    const year = this.year();
    const date = this.selectedValueAsDate ?? new Date(TODAY);
    date.setFullYear(year);
    const dateString = date.toLocaleDateString(this.locale(), {
      year: 'numeric',
    });
    return dateString;
  });
  readonly yearsOpen = signal(false);

  readonly dayNames = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), {
      weekday: 'narrow',
    });
    return Array.from({ length: 7 }, (_, i) =>
      formatter.format(new Date(1970, 0, i + 4))
    );
  });

  readonly calendarDays = computed(() => {
    const date = new Date(this.year(), this.month());
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

  constructor() {
    super();
    toObservable(this.yearsOpen)
      .pipe(
        filter(() => isPlatformBrowser(this.platformId)),
        tap((open) => {
          if (open && this.monthsOpen()) {
            this.monthsOpen.set(false);
          }
        }),
        delay(durationToMilliseconds('short4')),
        tap(() => {
          const element =
            this.yearsList()?.hostElement.querySelector('[selected]');
          element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        })
      )
      .subscribe();
    toObservable(this.monthsOpen)
      .pipe(
        filter(() => isPlatformBrowser(this.platformId)),
        tap((open) => {
          if (open && this.yearsOpen()) {
            this.yearsOpen.set(false);
          }
        }),
        filter((x) => x),
        delay(durationToMilliseconds('short4')),
        tap(() => {
          const element =
            this.yearsList()?.hostElement.querySelector('[selected]');
          element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        })
      )
      .subscribe();
    effect(() => {
      const min = this.minAsDate;
      const max = this.maxAsDate;
      const selectedValue = this.selectedValueAsDate;
      if (min && selectedValue && selectedValue < min) {
        this.selectedValueAsDate = undefined;
      }
      if (max && selectedValue && selectedValue > max) {
        this.selectedValueAsDate = undefined;
      }
    });
    effect(() => {
      const open = this.open();
      if (open) {
        return;
      }
      this.month.set(this.selectedValueAsDate?.getMonth() ?? TODAY.getMonth());
      this.monthsOpen.set(false);
      this.year.set(
        this.selectedValueAsDate?.getFullYear() ?? TODAY.getFullYear()
      );
      this.yearsOpen.set(false);
    });
  }

  bodyClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
      return;
    }
    this.open.set(true);
  }

  setMonth(month: number) {
    this.month.set(month);
    this.monthsOpen.set(false);
  }

  setYear(year: number) {
    this.year.set(year);
    this.yearsOpen.set(false);
  }

  goToToday() {
    this.month.set(TODAY.getMonth());
    this.year.set(TODAY.getFullYear());
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

  isInRange(date: Date) {
    const min = this.minAsDate;
    const max = this.maxAsDate;
    if (min && date < min) {
      return false;
    }
    if (max && date > max) {
      return false;
    }
    return true;
  }

  isYearInRange(year: number) {
    const date = new Date(year, 0, 1);
    return this.isInRange(date);
  }

  isDateSelected(date: Date) {
    const selectedDate = this.selectedValueAsDate;
    const result = this.isDateEqual(selectedDate, date);
    return result;
  }

  select(date: Date) {
    this.selectedValueAsDate = date;
    this.month.set(date.getMonth());
    this.year.set(date.getFullYear());
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
