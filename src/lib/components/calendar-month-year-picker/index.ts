import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { mixinValueElement, property$ } from '../../common';
import { distinctUntilChanged, Observable, tap } from 'rxjs';

const base = mixinValueElement(LitElement);

@customElement('md-calendar-month-year-picker')
export class MdCalendarMonthYearPickerElement extends base {
  static override styles = [styles];

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
      return new Date();
    }
    return new Date(this.value);
  }
  set valueAsDate(date: Date) {
    this.value = date.toISOString();
  }

  private get _previousDate() {
    const date = this.valueAsDate;
    if (this.year) {
      date.setFullYear(date.getFullYear() - 1);
    } else {
      date.setMonth(date.getMonth() - 1);
    }
    return date;
  }

  private get _nextDate() {
    const date = this.valueAsDate;
    if (this.year) {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date;
  }

  override render() {
    const options: Intl.DateTimeFormatOptions = {};
    if (this.year) {
      options.year = 'numeric';
    } else {
      options.month = 'short';
    }
    return html`<md-button variant="plain" class="navigate" @click=${this.previousClick} ?disabled=${!this.isInRange(this._previousDate)}>
        <md-icon>chevron_left</md-icon>
      </md-button>
      <md-button variant="plain" class="center" @click=${this.centerClick}>
        ${this.valueAsDate.toLocaleDateString(this.locale, options)}
        <md-icon size="18">arrow_drop_down</md-icon>
      </md-button>
      <md-button variant="plain" class="navigate" @click=${this.nextClick} ?disabled=${!this.isInRange(this._nextDate)}>
        <md-icon>chevron_right</md-icon>
      </md-button> `;
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

  private centerClick() {
    this.dispatchEvent(new Event('center-click'));
  }

  private previousClick() {
    const date = this.valueAsDate;
    if (this.year) {
      date.setFullYear(date.getFullYear() - 1);
    } else {
      date.setMonth(date.getMonth() - 1);
    }
    this.valueAsDate = date;
  }

  private nextClick() {
    const date = this.valueAsDate;
    if (this.year) {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    this.valueAsDate = date;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-calendar-month-year-picker': MdCalendarMonthYearPickerElement;
  }
}
