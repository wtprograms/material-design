import { html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styles } from './styles';
import { mixinDropdown } from '../../common';
import { MdDatePickerCalendarElement } from '../date-picker-calendar';
import { MdDatePickerMonthsYearsElement } from '../date-picker-months-years';
import { MdDatePickerSelectorElement } from '../date-picker-selector';

const base = mixinDropdown(LitElement);

@customElement('md-date-picker')
export class MdDatePickerElement extends base {
  static override styles = [styles];

  @property({ type: String })
  locale = 'en';

  @state()
  get date(): Date | null {
    if (!this.value) {
      return null;
    }
    return this.value === '' ? new Date() : new Date(this.value);
  }
  set date(value: Date | null) {
    this.value = !value ? null : value.toISOString();
  }

  @state()
  selectedDate = this.date;

  @query('md-date-picker-calendar')
  private _calendar!: MdDatePickerCalendarElement;

  @query('#months')
  private _months!: MdDatePickerMonthsYearsElement;

  @query('#month-selector')
  private _monthSelector!: MdDatePickerSelectorElement;

  @query('#year-selector')
  private _yearSelector!: MdDatePickerSelectorElement;

  @query('#years')
  private _years!: MdDatePickerMonthsYearsElement;

  override renderPopupContent(): unknown {
    return html`<div class="popup-date">
      <div class="popup-date-header">
        <md-date-picker-selector
          id="month-selector"
          @left=${this.onPreviousMonth}
          @right=${this.onNextMonth}
          value=${this.value ?? ''}
          @center=${this.onOpenMonths}
        ></md-date-picker-selector>
        <md-date-picker-selector
          id="year-selector"
          @left=${this.onPreviousYear}
          @right=${this.onNextYear}
          locale=${this.locale}
          value=${this.value ?? ''}
          @center=${this.onOpenYears}
          year
        ></md-date-picker-selector>
      </div>
      <div class="popup-date-body">
        <md-date-picker-calendar
          locale=${this.locale}
          value=${this.value ?? ''}
          @value-change=${this.onCalendarChange}
        ></md-date-picker-calendar>
        <md-date-picker-months-years id="months" locale=${this.locale} value=${this.value ?? ''} @click=${this.onMonthChange}></md-date-picker-months-years>
        <md-date-picker-months-years id="years" years locale=${this.locale} value=${this.value ?? ''} @click=${this.onYearChange}></md-date-picker-months-years>
      </div>
      <div class="popup-date-footer">
        <md-button class="reset" variant="text" @click=${this.onReset}>Reset</md-button>
        <md-button variant="text" @click=${this.onCancel}>Cancel</md-button>
        <md-button variant="text" @click=${this.onOkay}>Okay</md-button>
      </div>
    </div>`;
  }

  private onMonthChange() {
    this._calendar.viewDate.setMonth(this._months.date.getMonth());
    this._monthSelector.date = this._calendar.viewDate;
    this._calendar.requestUpdate();
  }

  private onYearChange() {
    this._calendar.viewDate.setFullYear(this._years.date.getFullYear());
    this._yearSelector.date = this._calendar.viewDate;
    this._calendar.requestUpdate();
  }

  private onOpenMonths() {
    this._months.open = !this._months.open;
  }

  private onOpenYears() {
    this._years.open = !this._years.open;
  }

  private onPreviousMonth() {
    this._calendar.viewDate.setMonth(this._calendar.viewDate.getMonth() - 1);
    this._calendar.requestUpdate();
  }

  private onNextMonth() {
    this._calendar.viewDate.setMonth(this._calendar.viewDate.getMonth() + 1);
    this._calendar.requestUpdate();
  }

  private onPreviousYear() {
    this._calendar.viewDate.setFullYear(
      this._calendar.viewDate.getFullYear() - 1
    );
    this._calendar.requestUpdate();
  }

  private onNextYear() {
    this._calendar.viewDate.setFullYear(
      this._calendar.viewDate.getFullYear() + 1
    );
    this._calendar.requestUpdate();
  }

  private onCalendarChange() {
    this.selectedDate = this._calendar.date;
  }

  override renderInput(): unknown {
    if (!this.date) {
      return nothing;
    }
    const format = new Intl.DateTimeFormat(this.locale);
    const value = format.format(this.date);
    return html`${value}`;
  }

  private onCancel() {
    this.selectedDate = this.date;
    this.popup?.close();
    this._months.close();
  }

  private onOkay() {
    this.date = this.selectedDate;
    this.popup?.close();
    this._months.close();
  }

  private onReset() {
    this.date = null;
    this.selectedDate = null;
    this.popup?.close();
    this._months.close();
  }

  override renderTrailing(): unknown {
    return html`<div class="trailing">
      <md-icon>calendar_today</md-icon>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-date-picker': MdDatePickerElement;
  }
}
