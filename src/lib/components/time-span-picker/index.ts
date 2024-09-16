import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { mixinValueElement } from '../../common';
import { TimeSpan } from '../../common/helpers/time-span';

const base = mixinValueElement(LitElement);

@customElement('md-time-span-picker')
export class MdTimeSpanPickerElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, attribute: 'has-seconds' })
  hasSeconds = false;

  get valueAsTimeSpan() {
    if (!this.value) {
      return new TimeSpan();
    }
    return TimeSpan.parse(this.value);
  }
  set valueAsTimeSpan(value: TimeSpan) {
    this.value = value.toString();
  }

  override render() {
    const seconds = this.hasSeconds
      ? html`<span class="colon">:</span>
          <input
            type="number"
            autocomplete="off"
            .value=${this.valueAsTimeSpan.seconds}
            @input=${this.setSeconds}
          />`
      : nothing;
    return html`
      <input
        class="hour"
        type="number"
        autocomplete="off"
        .value=${this.valueAsTimeSpan.hours}
        @input=${this.setHours}
      />
      <span class="colon">:</span>
      <input
        type="number"
        autocomplete="off"
        .value=${this.valueAsTimeSpan.minutes}
        @input=${this.setMinutes}
      />
      ${seconds}
    `;
  }

  private setHours(event: Event) {
    const target = event.target as HTMLInputElement;
    this.valueAsTimeSpan.hours = parseInt(target.value, 10);
  }

  private setMinutes(event: Event) {
    const target = event.target as HTMLInputElement;
    this.valueAsTimeSpan.minutes = parseInt(target.value, 10);
  }

  private setSeconds(event: Event) {
    const target = event.target as HTMLInputElement;
    this.valueAsTimeSpan.seconds = parseInt(target.value, 10);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-time-span-picker': MdTimeSpanPickerElement;
  }
}
