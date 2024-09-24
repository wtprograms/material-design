/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styles } from './styles';
import { MdCalendarMonthYearListPickerElement } from '../calendar-month-year-list-picker';
import { getFormState, getFormValue, mixinElementInternals, mixinFormAssociated, mixinStringValue } from '../../common';

const base = mixinStringValue(mixinFormAssociated(mixinElementInternals(LitElement)));
@customElement('md-date-picker')
export class MdDatePickerElement extends base {
  static override styles = [styles];

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

  @state()
  viewValue = this.value;

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

  override render() {
    return html`<div class="header">
        <md-calendar-month-year-picker
          id="month-picker"
          locale=${this.locale}
          min=${this.min}
          max=${this.max}
          value=${this.viewValue}
          @change=${this.changeViewDate}
        ></md-calendar-month-year-picker>
        <md-button variant="plain" class="today" @click=${this.todayClick}
          >${this.todayText}</md-button
        >
        <md-calendar-month-year-picker
          id="year-picker"
          locale=${this.locale}
          min=${this.min}
          max=${this.max}
          value=${this.viewValue}
          @change=${this.changeViewDate}
          year
        ></md-calendar-month-year-picker>
      </div>
      <md-calendar-picker
        locale=${this.locale}
        min=${this.min}
        max=${this.max}
        value=${this.value}
        view-value=${this.viewValue}
        @change=${this.change}
      ></md-calendar-picker>
      <md-popover
        for="month-picker"
        custom-event="center-click"
        offset="8"
        @open=${this.scrollSelectedIntoView}
        no-elevation
        close-on-event
        stop-close-propegation
      >
        <md-calendar-month-year-list-picker
          locale=${this.locale}
          min=${this.min}
          max=${this.max}
          id="month-list"
          value=${this.viewValue}
          @change=${this.changeViewDate}
        ></md-calendar-month-year-list-picker>
      </md-popover>
      <md-popover
        for="year-picker"
        custom-event="center-click"
        offset="8"
        @open=${this.scrollSelectedIntoView}
        no-elevation
        close-on-event
        close-stop-propegation
      >
        <md-calendar-month-year-list-picker
          locale=${this.locale}
          min=${this.min}
          max=${this.max}
          id="year-list"
          value=${this.viewValue}
          @change=${this.changeViewDate}
          year
        ></md-calendar-month-year-list-picker>
      </md-popover>`;
  }

  private scrollSelectedIntoView() {
    this._monthPicker.scrollSelectedIntoView();
    this._yearPicker.scrollSelectedIntoView();
  }

  private todayClick() {
    this.viewValueAsDate = new Date();
  }

  private change(event: Event) {
    this.value = (event.target as any).value;
  }

  private changeViewDate(event: Event) {
    this.viewValue = (event.target as any).value;
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
    'md-date-picker': MdDatePickerElement;
  }
}
