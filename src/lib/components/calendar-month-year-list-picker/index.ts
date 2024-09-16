import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { Observable, distinctUntilChanged, tap } from 'rxjs';
import { mixinValueElement, property$ } from '../../common';
import { repeat } from 'lit/directives/repeat.js';

const base = mixinValueElement(LitElement);

@customElement('md-calendar-month-year-list-picker')
export class MdCalendarMonthYearListPickerElement extends base {
  static override styles = [styles];

  @property({ type: String })
  min: string | null = null;

  @property({ type: String })
  max: string | null = null;

  @property({ type: String })
  locale = 'en';

  @property({ type: Boolean })
  year = false;

  get months(): { text: string; date: Date }[] {
    const formatter = new Intl.DateTimeFormat(this.locale, { month: 'long' });
    const date = Date.parseString(this.value, new Date());
    return Array.from({ length: 12 }, (_, i) => ({
      text: formatter.format(new Date(0, i)),
      date: new Date(date.getFullYear(), i),
    }));
  }

  get years(): { year: number; date: Date }[] {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 50;
    const endYear = currentYear + 20;
    const date = Date.parseString(this.value, new Date());
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
      year: startYear + i,
      date: new Date(startYear + i, date.getMonth()),
    }));
  }

  override render() {
    const dateValue = Date.parseString(this.value, new Date());
    if (this.year) {
      return html`${repeat(
        this.years,
        (x) => x.year,
        (x) =>
          html` <md-list-item
            value=${x.year}
            @click=${() => this.handleYearClick(x.year)}
            ?selected=${x.year === dateValue.getFullYear()}
            ?disabled=${!this.isInRange(x.date)}
            >${x.year}</md-list-item
          >`
      )}`;
    } else {
      return html`${repeat(
        this.months,
        (x) => x.text,
        (x, index) =>
          html` <md-list-item
            value=${index}
            @click=${() => this.handleMonthClick(index)}
            ?selected=${index === dateValue.getMonth()}
            ?disabled=${!this.isInRange(x.date)}
            >${x.text}</md-list-item
          >`
      )}`;
    }
  }

  scrollSelectedIntoView() {
    const selectedItem = this.shadowRoot?.querySelector(
      'md-list-item[selected]'
    );
    if (selectedItem) {
      selectedItem.scrollIntoView();
    }
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

  private handleMonthClick(month: number) {
    const date = Date.parseString(this.value, new Date());
    date.setMonth(month);
    this.value = date.toString();
    this.dispatchEvent(new Event('close-popover', { bubbles: true }));
  }

  private handleYearClick(year: number) {
    const date = Date.parseString(this.value, new Date());
    date.setFullYear(year);
    this.value = date.toString();
    this.dispatchEvent(new Event('close-popover', { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-calendar-month-year-list-picker': MdCalendarMonthYearListPickerElement;
  }
}
