import { html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styles } from './styles';
import { property$ } from '../../common';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { MdCalendarMonthYearListPickerElement } from '../calendar-month-year-list-picker';

@customElement('md-date-picker')
export class MdDatePickerElement extends LitElement {
  static override styles = [styles];

  @property({ type: String })
  @property$()
  value = '';
  value$!: Observable<string>;

  @property({ type: String })
  locale = 'en';

  @property({ type: Boolean })
  year = false;

  @property({ type: String })
  todayText = 'Today';

  @property({ type: String })
  min: string | null = null;

  @property({ type: String })
  max: string | null = null;

  @query('#month-list')
  private _monthPicker!: MdCalendarMonthYearListPickerElement;

  @query('#year-list')
  private _yearPicker!: MdCalendarMonthYearListPickerElement;

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

  @state()
  private _viewValue = this.value;

  private get _viewValueAsDate() {
    if (!this._viewValue) {
      return new Date();
    }
    return new Date(this._viewValue);
  }
  private set _viewValueAsDate(date: Date) {
    this._viewValue = date.toISOString();
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

  override render() {
    return html`<div class="header">
      <md-calendar-month-year-picker id="month-picker" locale=${this.locale} min=${this.min} max=${this.max} value=${this._viewValue} @change=${this.changeViewDate}></md-calendar-month-year-picker>
      <md-button variant="plain" class="today" @click=${this.todayClick}
        >${this.todayText}</md-button
      >
      <md-calendar-month-year-picker id="year-picker" locale=${this.locale} min=${this.min} max=${this.max} value=${this._viewValue} @change=${this.changeViewDate} year></md-calendar-month-year-picker>
    </div>
    <md-calendar-picker locale=${this.locale} min=${this.min} max=${this.max} value=${this.value} view-value=${this._viewValue} @change=${this.change}></md-calendar-picker>
    <md-popover for="month-picker" custom-event="center-click" offset="8" @open=${this.scrollSelectedIntoView} no-elevation close-on-event>
      <md-calendar-month-year-list-picker locale=${this.locale} min=${this.min} max=${this.max} id="month-list" value=${this._viewValue} @change=${this.changeViewDate}></md-calendar-month-year-list-picker>
    </md-popover>
    <md-popover for="year-picker" custom-event="center-click" offset="8" @open=${this.scrollSelectedIntoView} no-elevation close-on-event>
      <md-calendar-month-year-list-picker locale=${this.locale} min=${this.min} max=${this.max} id="year-list" value=${this._viewValue} @change=${this.changeViewDate} year></md-calendar-month-year-list-picker>
    </md-popover>`;
  }

  private scrollSelectedIntoView() {
    this._monthPicker.scrollSelectedIntoView();
    this._yearPicker.scrollSelectedIntoView();
  }

  private todayClick() {
    this._viewValueAsDate = new Date();
  }

  private change(event: Event) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.value = (event.target as any).value;
  }

  private changeViewDate(event: Event) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._viewValue = (event.target as any).value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-date-picker': MdDatePickerElement;
  }
}
