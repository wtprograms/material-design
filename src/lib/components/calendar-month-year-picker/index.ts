import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { mixinValueElement, observe, property$ } from '../../common';
import { distinctUntilChanged, map, Observable, tap } from 'rxjs';

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

  private _date$ = this.value$.pipe(
    map((x) => Date.parseString(x, new Date()))
  );

  override render() {
    const options: Intl.DateTimeFormatOptions = {};
    if (this.year) {
      options.year = 'numeric';
    } else {
      options.month = 'short';
    }
    const dateString = this._date$.pipe(
      map(x => x.toLocaleDateString(this.locale, options))
    );
    return html`<md-button
        variant="plain"
        class="navigate"
        @click=${() => this.navigateClick(-1)}
        ?disabled=${observe(this.isNotInRange(-1))}
      >
        <md-icon>chevron_left</md-icon>
      </md-button>
      <md-button variant="plain" class="center" @click=${this.centerClick}>
        ${observe(dateString)}
        <md-icon size="18">arrow_drop_down</md-icon>
      </md-button>
      <md-button
        variant="plain"
        class="navigate"
        @click=${() => this.navigateClick(1)}
        ?disabled=${observe(this.isNotInRange(1))}
      >
        <md-icon>chevron_right</md-icon>
      </md-button> `;
  }

  private isNotInRange(index: -1 | 1) {
    return this.getDate(index).pipe(
      map((x) => {
        if (this.min && x < new Date(this.min)) {
          return true;
        }
        if (this.max && x > new Date(this.max)) {
          return true;
        }
        return false;
      })
    );
  }

  private getDate(index: -1 | 1) {
    return this._date$.pipe(
      map((x) => {
        if (this.year) {
          x.setFullYear(x.getFullYear() + index);
        } else {
          x.setMonth(x.getMonth() + index);
        }
        return x;
      })
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
}

declare global {
  interface HTMLElementTagNameMap {
    'md-calendar-month-year-picker': MdCalendarMonthYearPickerElement;
  }
}
