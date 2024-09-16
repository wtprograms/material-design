import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { attribute, mixinValueElement, observe } from '../../common';
import { BehaviorSubject, distinctUntilChanged, map, Subject, tap } from 'rxjs';
import { getMeridianValues } from '../../common/helpers/date/get-meridian-values';
import { classMap } from 'lit/directives/class-map.js';

const base = mixinValueElement(LitElement);

@customElement('md-time-picker')
export class MdTimePickerElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, attribute: 'has-seconds' })
  hasSeconds = false;

  @property({ type: String })
  locale = 'en';

  get hours() {
    const hours = Date.parseString(this.value, new Date()).getHours();
    return hours % 12 === 0 ? 12 : hours % 12;
  }
  set hours(value: number) {
    const date = Date.parseString(this.value, new Date());
    date.setHours(value);
    this.value = date.toString();
  }

  get minutes() {
    return Date.parseString(this.value, new Date()).getMinutes();
  }
  set minutes(value: number) {
    const date = Date.parseString(this.value, new Date());
    date.setMinutes(value);
    this.value = date.toString();
  }

  get seconds() {
    return Date.parseString(this.value, new Date()).getSeconds();
  }
  set seconds(value: number) {
    const date = Date.parseString(this.value, new Date());
    date.setSeconds(value);
    this.value = date.toString();
  }

  get meridian() {
    return this.hours >= 12 ? 'pm' : 'am';
  }
  set meridian(value: string) {
    if (value === 'am') {
      this.hours = this.hours % 12;
    } else {
      this.hours = this.hours % 12 + 12;
    }
  }

  override render() {
    const meridianValues = getMeridianValues(this.locale);

    const seconds = this.hasSeconds
      ? html`<span class="colon">:</span>
          <input
            type="number"
            min="0"
            max="59"
            autocomplete="off"
            .value=${this.seconds}
            @input=${this.setSeconds}
            @keyup=${this.enforceMinMax}
          />`
      : nothing;
    return html`
      <input
        class="hour"
        type="number"
        min="0"
        max="12"
        autocomplete="off"
        .value=${this.hours}
        @input=${this.setHours}
        @keyup=${this.enforceMinMax}
      />
      <span class="colon">:</span>
      <input
        type="number"
        min="0"
        max="59"
        autocomplete="off"
        .value=${this.minutes}
        @input=${this.setMinutes}
        @keyup=${this.enforceMinMax}
      />
      ${seconds}
      <div class="meridian">
        ${this.renderMeridianButton('am', meridianValues[0])}
        ${this.renderMeridianButton('pm', meridianValues[1])}
      </div>
    `;
  }

  private renderMeridianButton(meridian: string, meridianValue: string) {
    const hours = Date.parseString(this.value, new Date()).getHours();
    const classes = classMap({
      am: meridian === 'am',
      pm: meridian === 'pm',
      selected: meridian === 'am' ? hours < 12 : hours >= 12,
    });
    return html`<md-button
      variant="plain"
      class=${classes}
      @click=${() => this.meridian = meridian}
      >${meridianValue}</md-button
    >`;
  }

  private setHours(event: Event) {
    const value = this.getRanged(event);
    const date = Date.parseString(this.value, new Date());
    date.setHours(value);
    this.value = date.toString();
  }

  private setMinutes(event: Event) {
    const value = this.getRanged(event);
    const date = Date.parseString(this.value, new Date());
    date.setMinutes(value);
    this.value = date.toString();
  }

  private setSeconds(event: Event) {
    const value = this.getRanged(event);
    const date = Date.parseString(this.value, new Date());
    date.setSeconds(value);
    this.value = date.toString();
  }

  private getRanged(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = !target.value ? 0 : parseInt(target.value, 10);
    const _min = parseInt(target.min, 10);
    const _max = parseInt(target.max, 10);
    return Math.min(Math.max(value, _min), _max);
  }

  private enforceMinMax(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.value != "") {
      if (parseInt(target.value) < parseInt(target.min)) {
        target.value = target.min;
      }
      if (parseInt(target.value) > parseInt(target.max)) {
        target.value = target.max;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-time-picker': MdTimePickerElement;
  }
}
