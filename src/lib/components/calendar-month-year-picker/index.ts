import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { mixinFormAssociated, mixinElementInternals, mixinStringValue, getFormState, getFormValue } from '../../common';

const base = mixinStringValue(mixinFormAssociated(mixinElementInternals(LitElement)));

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
    return Date.parseString(this.value, new Date());
  }
  set valueAsDate(value: Date) {
    this.value = value.toString();
  }

  override render() {
    const options: Intl.DateTimeFormatOptions = {};
    if (this.year) {
      options.year = 'numeric';
    } else {
      options.month = 'short';
    }
    const dateString = this.valueAsDate.toLocaleDateString(
      this.locale,
      options
    );
    return html`<md-button
        variant="plain"
        class="navigate"
        @click=${() => this.navigateClick(-1)}
        ?disabled=${!this.isInRange(-1)}
      >
        <md-icon>chevron_left</md-icon>
      </md-button>
      <md-button variant="plain" class="center" @click=${this.centerClick}>
        ${dateString}
        <md-icon size="18">arrow_drop_down</md-icon>
      </md-button>
      <md-button
        variant="plain"
        class="navigate"
        @click=${() => this.navigateClick(1)}
        ?disabled=${!this.isInRange(1)}
      >
        <md-icon>chevron_right</md-icon>
      </md-button> `;
  }

  private isInRange(index: -1 | 1) {
    return (
      this.min &&
      index >= new Date(this.min).getTime() &&
      this.max &&
      index <= new Date(this.max).getTime()
    );
  }

  private centerClick() {
    this.dispatchEvent(new Event('center-click'));
  }

  private navigateClick(index: 1 | -1) {
    const valueAsDate = Date.parseString(this.value, new Date());
    const date = valueAsDate;
    if (this.year) {
      date.setFullYear(date.getFullYear() + index);
    } else {
      date.setMonth(date.getMonth() + index);
    }
    this.value = date.toString();
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
    'md-calendar-month-year-picker': MdCalendarMonthYearPickerElement;
  }
}
