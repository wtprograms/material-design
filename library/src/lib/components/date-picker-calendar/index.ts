import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styles } from './styles';
import { classMap } from 'lit/directives/class-map.js';

@customElement('md-date-picker-calendar')
export class MdDatePickerCalendarElement extends LitElement {
  static override styles = [styles];

  @property({ type: String })
  locale = 'en';

  @property({ type: String })
  value = '';

  @state()
  get date(): Date {
    return this.value === '' ? new Date() : new Date(this.value);
  }
  set date(value: Date) {
    this.value = value.toISOString();
  }

  @state()
  viewDate = this.date;

  override render() {
    const days = Array.from(this.renderWeeks());
    return html`${days}`;
  }

  private *renderWeeks() {
    const daysOfWeek = Array.from(this.getDaysOfWeek());
    for (const day of daysOfWeek) {
      yield html`<span class="header">${day}</span>`;
    }

    const date = this.viewDate ? this.viewDate : new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const lastDatePrevMonth = new Date(year, month, 0).getDate();

    let day = 1;
    for (let week = 0; week < 6; week++) {
      for (let i = 0; i < 7; i++) {
        if (week === 0 && i < firstDay) {
          const prevMonthDay = lastDatePrevMonth - (firstDay - i - 1);
          const prevMonthDate = new Date(year, month - 1, prevMonthDay);
          yield html`<md-icon-button class="outside"
            @click="${() => this.setValue(prevMonthDate)}"
            >${prevMonthDay}</md-icon-button
          >`;
        } else if (day > lastDate) {
          const nextMonthDay = day - lastDate;
          const nextMonthDate = new Date(year, month + 1, nextMonthDay);
          yield html`<md-icon-button class="outside"
            @click="${() => this.setValue(nextMonthDate)}"
            >${nextMonthDay}</md-icon-button
          >`;
          day++;
        } else {
          const _classMap = {
            today: this.isEqualDate(new Date(year, month, day), new Date()),
          };
          const selected = this.isEqualDate(
            new Date(year, month, day),
            this.date ? this.date : new Date()
          );
          const variant = selected ? 'filled' : 'standard';
          const currentDate = new Date(year, month, day);
          yield html`<md-icon-button
            variant=${variant}
            ?selected=${selected}
            class="${classMap(_classMap)}"
            @click="${() => this.setValue(currentDate)}"
            >${day}</md-icon-button
          >`;
          day++;
        }
      }
      if (day > lastDate) {
        break;
      }
    }
  }

  private setValue(date: Date) {
    this.date = date;
    this.viewDate = date;
    this.dispatchEvent(new CustomEvent('value-change', { bubbles: true }));
  }

  private isEqualDate(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate()=== date2.getDate()
    );
  }

  private *getDaysOfWeek(): Generator<string> {
    const dateHeader = new Date(2024, 8, 4);
    for (let i = 0; i < 7; i++) {
      dateHeader.setDate(i + 1);
      yield dateHeader.toLocaleDateString(this.locale, { weekday: 'short' });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-date-picker-calendar': MdDatePickerCalendarElement;
  }
}
