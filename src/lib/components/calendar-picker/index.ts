import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { property$ } from '../../common';
import { dateEqual } from '../../common/helpers/date-equal';

@customElement('md-calendar-picker')
export class MdCalendarPickerElement extends LitElement {
  static override styles = [styles];

  @property({ type: String })
  @property$()
  value = '';
  value$!: Observable<string>;

  @property({ type: String, attribute: 'view-value' })
  viewValue = '';

  @property({ type: String })
  locale = 'en';

  @property({ type: Boolean })
  year = false;

  @property({ type: String })
  min: string | null = null;

  @property({ type: String })
  max: string | null = null;

  get valueAsDate() {
    if (!this.value) {
      return null;
    }
    return new Date(this.value);
  }
  set valueAsDate(date: Date | null) {
    if (!date) {
      this.value = '';
    } else {
      this.value = date.toISOString();
    }
  }

  get viewValueAsDate() {
    if (!this.viewValue) {
      return new Date();
    }
    return new Date(this.viewValue);
  }
  set viewValueAsDate(date: Date) {
    this.viewValue = date.toISOString();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.value$
      .pipe(
        distinctUntilChanged(),
        tap(() => this.dispatchEvent(new Event('change')))
      )
      .subscribe();
  }

  private get _dayNames(): string[] {
    const formatter = new Intl.DateTimeFormat(this.locale, {
      weekday: 'narrow',
    });
    return Array.from({ length: 7 }, (_, i) =>
      formatter.format(new Date(1970, 0, i + 4))
    );
  }

  private get _calendarDays() {
    const firstDayOfMonth = new Date(
      this.viewValueAsDate.getFullYear(),
      this.viewValueAsDate.getMonth(),
      1
    ).getDay();
    const startDate = new Date(
      this.viewValueAsDate.getFullYear(),
      this.viewValueAsDate.getMonth(),
      1 - firstDayOfMonth
    );
    const calendarDays: {
      day: number;
      type: string;
      date: Date;
    }[] = [];

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const day = currentDate.getDate();
      let type = 'current';

      if (currentDate.getMonth() < this.viewValueAsDate.getMonth()) {
        type = 'previous';
      } else if (currentDate.getMonth() > this.viewValueAsDate.getMonth()) {
        type = 'next';
      }

      calendarDays.push({ day, type, date: currentDate });
    }

    return calendarDays;
  }

  override render() {
    const dayNames = this._dayNames;
    const calendarDays = this._calendarDays;
    return html`
      <div class="day-names">
        ${dayNames.map((day) => html`<div class="day-name">${day}</div>`)}
      </div>
      <div class="days">
        ${calendarDays.map(
          ({ day, type, date }) => html`
          <md-icon-button
            variant=${this.getVariant(date)}
            class=${
              (type === 'current' ? '' : 'not-current') +
              ' ' +
              (this.isToday(date) ? 'today' : '') +
              ' ' +
              (this.isInRange(date) ? '' : 'not-in-range')
            }
            ?selected=${this.valueAsDate && dateEqual(this.valueAsDate, date)}
            @click=${() => this.dayClick(date)}
            custom
          >
            ${day}
          </md-icon-button>
          </div>
        `
        )}
      </div>
    `;
  }

  private isInRange(date: Date) {
    if (this.min && date < new Date(this.min)) {
      return false;
    }
    if (this.max && date > new Date(this.max)) {
      return false;
    }
    return true;
  }

  private getVariant(date: Date) {
    if (this.valueAsDate && dateEqual(this.valueAsDate, date)) {
      return 'filled';
    }
    return 'standard';
  }

  private isToday(date: Date) {
    return dateEqual(new Date(), date);
  }

  private dayClick(date: Date) {
    this.valueAsDate = this.viewValueAsDate = date;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-calendar-picker': MdCalendarPickerElement;
  }
}
