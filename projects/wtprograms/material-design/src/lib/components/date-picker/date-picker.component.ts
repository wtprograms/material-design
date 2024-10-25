import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  model,
  signal,
  viewChild,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { FieldComponent, FieldVariant } from '../field/field.component';
import { CommonModule } from '@angular/common';
import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';
import { IconComponent } from '../icon/icon.component';
import { openClose, OpenCloseState } from '../../common/rxjs/open-close';
import { toSignal } from '@angular/core/rxjs-interop';
import { ListItemComponent } from '../list-item/list-item.component';
import { DialogComponent } from '../dialog/dialog.component';
import { SlotDirective } from '../../directives/slot.directive';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export type DatePickerVariant = 'embedded' | 'dropdown' | 'dialog';

interface Day {
  day: number;
  type: string;
  date: Date;
}

type ValueType = [string | undefined, string | undefined] | string | undefined;

@Component({
  selector: 'md-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    FieldComponent,
    CommonModule,
    IconComponent,
    FieldComponent,
    ListItemComponent,
    DialogComponent,
    SlotDirective,
    TooltipComponent,
    DateFormatPipe,
  ],
  hostDirectives: [],
  host: {},
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatePickerComponent),
    },
  ],
})
export class DatePickerComponent extends MaterialDesignValueAccessorComponent<ValueType> {
  readonly range = model(false);
  readonly variant = model<DatePickerVariant>('dropdown');
  readonly fieldVariant = model<FieldVariant>('filled');
  readonly prefix = model<string>();
  readonly suffix = model<string>();
  readonly label = model<string>();
  readonly field = viewChild<FieldComponent<ValueType>>('field');
  readonly dialog = viewChild<DialogComponent>('dialog');

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

  private readonly _today = new Date();

  override readonly value = model<ValueType>();
  readonly selectionValue = model<ValueType>(this.value());

  readonly canOkay = computed(() => {
    if (
      this.range() &&
      this.fromSelectedValueAsDate &&
      !this.toSelectedValueAsDate
    ) {
      return false;
    }
    return true;
  });

  get fromValueAsDate(): Date | undefined {
    if (this.range()) {
      return this.value()?.[0] ? new Date(this.value()![0]!) : undefined;
    }
    return this.value() ? new Date(this.value() as string) : undefined;
  }
  set fromValueAsDate(value: Date | undefined) {
    if (this.range()) {
      this.value.update((x) => [value?.toISOString(), x?.[1]]);
    } else {
      this.value.set(value?.toISOString());
    }
  }

  get toValueAsDate(): Date | undefined {
    if (!this.range()) {
      return undefined;
    }
    return this.value()?.[1] ? new Date(this.value()![1]!) : undefined;
  }
  set toValueAsDate(value: Date | undefined) {
    if (!this.range()) {
      return;
    }
    this.value.update((x) => [x?.[0], value?.toISOString()]);
  }

  get fromSelectedValueAsDate(): Date | undefined {
    if (this.range()) {
      return this.selectionValue()?.[0]
        ? new Date(this.selectionValue()![0]!)
        : undefined;
    }
    return this.selectionValue()
      ? new Date(this.selectionValue() as string)
      : undefined;
  }
  set fromSelectedValueAsDate(value: Date | undefined) {
    if (this.range()) {
      this.selectionValue.update((x) => [value?.toISOString(), x?.[1]]);
    } else {
      this.selectionValue.set(value?.toISOString());
    }
  }

  get toSelectedValueAsDate(): Date | undefined {
    if (!this.range()) {
      return undefined;
    }
    return this.selectionValue()?.[1]
      ? new Date(this.selectionValue()![1]!)
      : undefined;
  }
  set toSelectedValueAsDate(value: Date | undefined) {
    if (!this.range()) {
      return;
    }
    this.selectionValue.update((x) => [x?.[0], value?.toISOString()]);
  }

  readonly locale = model('en');

  readonly monthItems = viewChildren<ListItemComponent>('monthItem');
  readonly monthView = model(this._today.getMonth());
  readonly monthViewText = computed(() => {
    const month = this.monthView();
    const date = this.fromSelectedValueAsDate ?? new Date(this._today);
    date.setMonth(month);
    const dateString = date.toLocaleDateString(this.locale(), {
      month: 'short',
    });
    return dateString;
  });
  readonly months = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), { month: 'long' });
    return Array.from({ length: 12 }, (_, value) => ({
      text: formatter.format(new Date(0, value)),
      value,
    }));
  });

  readonly monthViewOpen = signal(false);
  readonly monthViewState = toSignal(openClose(this.monthViewOpen, 'short4'), {
    initialValue: 'closed',
  });

  readonly yearItems = viewChildren<ButtonComponent>('yearItem');
  readonly yearView = model(this._today.getFullYear());
  readonly yearViewText = computed(() => {
    const year = this.yearView();
    const date = this.fromSelectedValueAsDate ?? new Date(this._today);
    date.setFullYear(year);
    const dateString = date.toLocaleDateString(this.locale(), {
      year: 'numeric',
    });
    return dateString;
  });
  get years() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 50;
    const endYear = currentYear + 20;
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, value) => startYear + value
    );
  }

  readonly yearViewOpen = signal(false);
  readonly yearViewState = toSignal(openClose(this.yearViewOpen, 'short4'), {
    initialValue: 'closed',
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
    const month = this.monthView();
    const year = this.yearView();
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

  private fromSelection = true;

  constructor() {
    super();
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
  }

  openMonthView() {
    this.yearViewOpen.set(false);
    this.monthViewOpen.set(!this.monthViewOpen());
    const selectedItem = this.monthItems().find((x) => x.selected());
    selectedItem?.hostElement.scrollIntoView({
      block: 'nearest',
    });
  }

  monthItemClick(month: number) {
    this.monthView.set(month);
    this.monthViewOpen.set(false);
  }

  openYearView() {
    this.monthViewOpen.set(false);
    this.yearViewOpen.set(!this.yearViewOpen());
    const selectedItem = this.yearItems().find((x) => x.variant() === 'filled');
    selectedItem?.hostElement.scrollIntoView({
      block: 'nearest',
    });
  }

  yearItemClick(year: number) {
    this.yearView.set(year);
    this.yearViewOpen.set(false);
  }

  todayClick() {
    this.monthView.set(this._today.getMonth());
    this.yearView.set(this._today.getFullYear());
  }

  dayClick(day: Day) {
    if (this.fromSelection) {
      this.fromSelectedValueAsDate = day.date;
      this.toSelectedValueAsDate = undefined;
    } else {
      if (
        this.fromSelectedValueAsDate &&
        day.date < this.fromSelectedValueAsDate
      ) {
        this.fromSelection = !this.fromSelection;
        this.dayClick(day);
        return;
      }
      this.toSelectedValueAsDate = day.date;
    }
    this.monthView.set(day.date.getMonth());
    this.yearView.set(day.date.getFullYear());
    if (this.range()) {
      this.fromSelection = !this.fromSelection;
    }
  }

  isDateEqual(dateA?: Date, dateB?: Date) {
    return (
      dateA?.getFullYear() === dateB?.getFullYear() &&
      dateA?.getMonth() === dateB?.getMonth() &&
      dateA?.getDate() === dateB?.getDate()
    );
  }

  isToday(date: Date) {
    return (
      this._today.getFullYear() === date.getFullYear() &&
      this._today.getMonth() === date.getMonth() &&
      this._today.getDate() === date.getDate()
    );
  }

  isDaySelected(date: Date) {
    return (
      this.isDateEqual(this.fromSelectedValueAsDate, date) ||
      this.isDateEqual(this.toSelectedValueAsDate, date)
    );
  }

  isInRange(date: Date) {
    if (!this.fromSelectedValueAsDate || !this.toSelectedValueAsDate) {
      return false;
    }
    return (
      date >= this.fromSelectedValueAsDate && date <= this.toSelectedValueAsDate
    );
  }

  clearClick() {
    this.fromSelection = true;
    this.value.set(undefined);
    this.selectionValue.set(undefined);
  }

  okayClick() {
    this.fromSelection = true;
    this.value.set(this.selectionValue());
    this.monthView.set(
      this.fromSelectedValueAsDate?.getMonth() ?? this._today.getMonth()
    );
    this.yearView.set(
      this.fromSelectedValueAsDate?.getFullYear() ?? this._today.getFullYear()
    );
    if (this.variant() === 'dropdown') {
      this.field()?.open.set(false);
    }
    if (this.variant() === 'dialog') {
      this.dialog()?.open.set(false);
    }
    this.monthViewOpen.set(false);
    this.yearViewOpen.set(false);
  }

  cancelClick() {
    this.fromSelection = true;
    this.selectionValue.set(this.value());
    this.monthView.set(
      this.fromSelectedValueAsDate?.getMonth() ?? this._today.getMonth()
    );
    this.yearView.set(
      this.fromSelectedValueAsDate?.getFullYear() ?? this._today.getFullYear()
    );
    if (this.variant() === 'dropdown') {
      this.field()?.open.set(false);
    }
    if (this.variant() === 'dialog') {
      this.dialog()?.open.set(false);
    }
    this.monthViewOpen.set(false);
    this.yearViewOpen.set(false);
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
}
