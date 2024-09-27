import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { Observable } from 'rxjs';
import { getFormState, getFormValue, mixinElementInternals, mixinFormAssociated, mixinStringValue, ObservableElement } from '../../common';
import { classMap } from 'lit/directives/class-map.js';

type Day = {
  day: number;
  type: string;
  date: Date;
};

const base = mixinStringValue(mixinFormAssociated(mixinElementInternals(ObservableElement)));

@customElement('md-calendar-picker')
export class MdCalendarPickerElement extends base {
  static override styles = [styles];

  @property({ type: String, attribute: 'view-value' })
  viewValue: string | null = null;
  viewValue$!: Observable<string | null>;

  @property({ type: String })
  locale = 'en';

  @property({ type: Boolean })
  year = false;

  @property({ type: String })
  min: string | null = null;

  @property({ type: String })
  max: string | null = null;

  get valueAsDate() {
    return Date.parseString(this.value) ?? null;
  }
  set valueAsDate(value: Date | null | undefined) {
    this.value = value?.toString() ?? '';
  }

  get viewValueAsDate() {
    return Date.parseString(this.value, new Date());
  }
  set viewValueAsDate(value: Date) {
    this.value = value.toString();
  }

  get dayNames(): string[] {
    const formatter = new Intl.DateTimeFormat(this.locale, {
      weekday: 'narrow',
    });
    return Array.from({ length: 7 }, (_, i) =>
      formatter.format(new Date(1970, 0, i + 4))
    );
  }

  get calendarDays() {
    const date = this.viewValueAsDate;
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
  }

  override render() {
    const dayNames = this.dayNames;
    const days = this.calendarDays.map((day) => this.renderDay(day));
    return html`
      <div class="day-names">
        ${dayNames.map((day) => html`<div class="day-name">${day}</div>`)}
      </div>
      <div class="days">${days}</div>
    `;
  }

  private renderDay(day: Day) {
    const classes = classMap({
      'not-current': day.type !== 'current',
      today: day.date.isToday(),
      'not-in-range': !day.date.isInRange(this.min, this.max),
    });
    const variant = day.date.isDateEqual(
      Date.parseString(this.value, new Date())
    )
      ? 'filled'
      : 'standard';
    return html`<md-icon-button
      variant=${variant}
      class=${classes}
      ?selected=${day.date.isDateEqual(
        Date.parseString(this.value, new Date())
      )}
      @click=${() => this.dayClick(day.date)}
      custom
    >
      ${day.day}
    </md-icon-button>`;
  }

  private dayClick(date: Date) {
    const value = date.toString();
    this.value = value;
    this.viewValue = value;
  }

  override [getFormValue]() {
    return this.value || null;
  }

  override [getFormState]() {
    return this.value;
  }

  override formResetCallback() {
    this.value = '';
  }

  override formStateRestoreCallback(state: string) {
    this.value = state;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-calendar-picker': MdCalendarPickerElement;
  }
}
