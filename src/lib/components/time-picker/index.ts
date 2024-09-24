import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { getFormState, getFormValue, getMeridianValues, mixinElementInternals, mixinFormAssociated, mixinStringValue } from '../../common';
import { TimeSpan } from '../../common/helpers/time-span';
import { classMap } from 'lit/directives/class-map.js';
import {live} from 'lit/directives/live.js';

const base = mixinStringValue(mixinFormAssociated(mixinElementInternals(LitElement)));

@customElement('md-time-picker')
export class MdTimePickerElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, attribute: 'has-seconds' })
  hasSeconds = false;

  @property({ type: Boolean, attribute: 'time-of-day' })
  timeOfDay = false;

  @property({ type: String })
  locale = 'en';

  @property({ type: String })
  min: string | null = null;

  @property({ type: String })
  max: string | null = null;

  get minAsTimeSpan() {
    return this.min ? TimeSpan.parse(this.min) : null;
  }
  set minAsTimeSpan(value: TimeSpan | null) {
    this.min = value?.toString() ?? null;
  }

  get maxAsTimeSpan() {
    return this.max ? TimeSpan.parse(this.max) : null;
  }
  set maxAsTimeSpan(value: TimeSpan | null) {
    this.max = value?.toString() ?? null;
  }

  get meridian() {
    return this.valueAsTimeOfDay.getHours() < 12 ? 'AM' : 'PM';
  }
  set meridian(value: string) {
    const date = this.valueAsTimeOfDay;
    const hours = date.getHours();
    if (value.toUpperCase() === 'AM') {
      date.setHours(hours + 12);
    } else if (value.toUpperCase() === 'PM') {
      date.setHours(hours - 12);
    }
    this.valueAsTimeOfDay = date;
  }

  get valueAsTimeSpan() {
    if (!this.value) {
      return new TimeSpan();
    }
    return TimeSpan.parse(this.value);
  }
  set valueAsTimeSpan(value: TimeSpan) {
    this.value = value.toString();
  }

  get valueAsTimeOfDay() {
    const date = new Date();
    const timeSpan = this.valueAsTimeSpan;
    date.setHours(timeSpan.hours);
    date.setMinutes(timeSpan.minutes);
    date.setSeconds(timeSpan.seconds);
    return date;
  }
  set valueAsTimeOfDay(value: Date) {
    const timeSpan = new TimeSpan(
      value.getHours(),
      value.getMinutes(),
      value.getSeconds()
    );
    this.valueAsTimeSpan = timeSpan;
  }

  override render() {
    const hourMax = this.timeOfDay ? 12 : nothing;
    const seconds = this.hasSeconds
      ? html`<span class="colon">:</span>
          <input
            type="number"
            autocomplete="off"
            min="0"
            max="59"
            .value=${live(this.valueAsTimeSpan.seconds)}
            @input=${this.setSeconds}
            @keyup=${this.enforceMinMax}
          />`
      : nothing;
    return html`
      <input
        class="hour"
        type="number"
        autocomplete="off"
        min="0"
        max=${hourMax}
        .value=${live(this.valueAsTimeSpan.hours)}
        @input=${this.setHours}
        @keyup=${this.enforceMinMax}
      />
      <span class="colon">:</span>
      <input
        type="number"
        autocomplete="off"
        .value=${live(this.valueAsTimeSpan.minutes)}
        min="0"
        max="59"
        @input=${this.setMinutes}
        @keyup=${this.enforceMinMax}
      />
      ${seconds} ${this.renderMeridianButtons()}
    `;
  }

  private renderMeridianButtons() {
    return this.timeOfDay
      ? html`
          <div class="meridian">
            ${this.renderMeridianButton('AM')}
            ${this.renderMeridianButton('PM')}
          </div>
        `
      : nothing;
  }

  private renderMeridianButton(meridian: string) {
    const classes = classMap({
      am: meridian === 'AM',
      pm: meridian === 'PM',
      selected: this.meridian === meridian,
    });
    const text = getMeridianValues(this.locale)[meridian.toLowerCase()];
    return html`<md-button
      variant="plain"
      @click=${() => (this.meridian = meridian)}
      class=${classes}
      >${text}</md-button
    >`;
  }

  private setHours(event: Event) {
    const target = event.target as HTMLInputElement;
    const timeSpan = this.valueAsTimeSpan;
    let hours = parseInt(target.value, 10);
    if (this.timeOfDay) {
      hours = hours > 12 ? 12 : hours;
    }
    timeSpan.hours = hours;
    this.valueAsTimeSpan = this.compare(timeSpan);
  }

  private setMinutes(event: Event) {
    const target = event.target as HTMLInputElement;
    const timeSpan = this.valueAsTimeSpan;
    timeSpan.minutes = parseInt(target.value, 10);
    if (this.timeOfDay) {
      timeSpan.hours = timeSpan.hours > 12 ? 12 : timeSpan.hours;
    }
   this.valueAsTimeSpan = this.compare(timeSpan);
  }

  private setSeconds(event: Event) {
    const target = event.target as HTMLInputElement;
    let timeSpan = this.valueAsTimeSpan;
    timeSpan.seconds = parseInt(target.value, 10);
    if (this.timeOfDay) {
      timeSpan.hours = timeSpan.hours > 12 ? 12 : timeSpan.hours;
    }
    this.valueAsTimeSpan = this.compare(timeSpan);
  }

  private compare(timeSpan: TimeSpan): TimeSpan {
    if (this.minAsTimeSpan) {
      timeSpan = timeSpan.min(this.minAsTimeSpan);
    }
    if (this.maxAsTimeSpan) {
      timeSpan = timeSpan.max(this.maxAsTimeSpan);
    }
    return timeSpan;
  }

  private enforceMinMax(event: Event) {
    const el = event.target as HTMLInputElement;
    if (el.value != '') {
      if (parseInt(el.value) < parseInt(el.min)) {
        el.value = el.min;
      }
      if (parseInt(el.value) > parseInt(el.max)) {
        el.value = el.max;
      }
    }
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
    'md-time-picker': MdTimePickerElement;
  }
}
