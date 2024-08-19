import { html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styles } from './styles';
import { mixinDropdown } from '../../common';

const base = mixinDropdown(LitElement);

export class Time {
  constructor(public hours = 0, public minutes = 0, public seconds = 0) {}

  static parse(value: string): Time {
    const sections = value.split(':');
    return new Time(parseInt(sections[0]), parseInt(sections[1]));
  }

  toString(pad = false, withSeconds = false): string {
    let result = '';
    if (pad) {
      result = `${this.hours.toString().padStart(2, '0')}:${this.minutes
        .toString()
        .padStart(2, '0')}`;
      result += withSeconds
        ? `:${this.seconds.toString().padStart(2, '0')}`
        : '';
    } else {
      result = `${this.hours}:${this.minutes}`;
      result += withSeconds ? `:${this.seconds}` : '';
    }
    return result;
  }

  equals(time: Time): boolean {
    return (
      this.hours === time.hours &&
      this.minutes === time.minutes &&
      this.seconds === time.seconds
    );
  }
}

@customElement('md-time-picker')
export class MdTimePickerElement extends base {
  static override styles = [styles];

  @property({ type: String })
  locale = 'en';

  @property({ type: Boolean, reflect: true })
  seconds = false;

  @state()
  get time(): Time | null {
    if (!this.value) {
      return null;
    }
    return Time.parse(this.value);
  }
  set time(value: Time | null) {
    this.value = !value ? null : value.toString();
  }

  @state()
  selectedTime = this.time;

  @query('#hours')
  private _hours!: HTMLInputElement;

  @query('#minutes')
  private _minutes!: HTMLInputElement;

  @query('#seconds')
  private _seconds?: HTMLInputElement;

  override renderPopupContent(): unknown {
    const seconds = this.seconds
      ? html`<span class="colon">:</span>
          <input
            id="minutes"
            class="input"
            value=${this.time?.minutes ?? ''}
            type="number"
            @input=${this.onInput}
          />`
      : nothing;
    return html`<div class="popup-time">
      <div class="popup-time-body">
        <input
          id="hours"
          class="input hours"
          value=${this.time?.hours ?? ''}
          @input=${this.onInput}
          type="number"
        />
        <span class="colon">:</span>
        <input
          id="seconds"
          class="input"
          value=${this.time?.seconds ?? ''}
          type="number"
          @input=${this.onInput}
        />
        ${seconds}
      </div>
      <div class="popup-time-footer">
        <md-button class="reset" variant="text" @click=${this.onReset}
          >Reset</md-button
        >
        <md-button variant="text" @click=${this.onCancel}>Cancel</md-button>
        <md-button variant="text" @click=${this.onOkay}>Okay</md-button>
      </div>
    </div>`;
  }

  private onInput() {
    this.selectedTime ??= new Time(0, 0);
    let hours = parseInt(this._hours.value);
    hours = Number.isNaN(hours) ? 0 : hours;
    let minutes = parseInt(this._minutes.value);
    minutes = Number.isNaN(minutes) ? 0 : minutes;
    let seconds = this._seconds ? parseInt(this._seconds.value) : 0;
    seconds = Number.isNaN(seconds) ? 0 : seconds;
    const selectedTime = new Time(hours, minutes, seconds);
    if (selectedTime.equals(this.selectedTime)) {
      return;
    }
    this.selectedTime = selectedTime;
    this._hours.value = this.selectedTime.hours.toString();
    this._minutes.value = this.selectedTime.minutes.toString();
    if (this._seconds) {
      this._seconds.value = this.selectedTime.seconds.toString();
    }
  }

  override renderInput(): unknown {
    if (!this.time) {
      return nothing;
    }
    return html`${this.time.toString(true)}`;
  }

  private onCancel() {
    this.selectedTime = this.time;
    this.popup?.close();
  }

  private onOkay() {
    this.time = this.selectedTime;
    this.popup?.close();
  }

  private onReset() {
    this.time = null;
    this.selectedTime = null;
    this._hours.value = '';
    this._minutes.value = '';
    this.popup?.close();
  }

  override renderTrailing(): unknown {
    return html`<div class="trailing">
      <md-icon>schedule</md-icon>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-time-picker': MdTimePickerElement;
  }
}
