import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styles } from './styles';

@customElement('md-date-picker-selector')
export class MdDatePickerSelectorElement extends LitElement {
  static override styles = [styles];

  @property({ type: String })
  locale = 'en';

  @property({ type: Boolean })
  year = false;

  @property({ type: Boolean, reflect: true, attribute: 'disabled-left' })
  disabledLeft = false;

  @property({ type: Boolean, reflect: true, attribute: 'disabled-right' })
  disabledRight = false;

  @property({ type: String })
  value = '';

  @state()
  get date(): Date {
    return this.value === '' ? new Date() : new Date(this.value);
  }
  set date(value: Date) {
    this.value = value.toISOString();
  }

  get formattedDate(): string {
    const options: Intl.DateTimeFormatOptions = this.year ? { year: 'numeric' } : { month: 'short' };
    const format = new Intl.DateTimeFormat(this.locale, options);
    return format.format(this.date);
  }

  override render() {
    return html`<button id="left" @click=${this.onLeftClick}>
        ${this.renderAttachables('left')}
        <md-icon>chevron_left</md-icon></button
      ><button id="center" @click=${this.onCenterClick}>
        ${this.renderAttachables('center')} ${this.formattedDate}<md-icon
          >arrow_drop_down</md-icon
        ></button
      ><button id="right" @click=${this.onRightClick}>
        ${this.renderAttachables('right')}
        <md-icon>chevron_right</md-icon>
      </button>`;
  }

  private renderAttachables(id: string) {
    return html` <md-ripple for="${id}" activatable></md-ripple>
      <md-focus-ring for="${id}" focus-visible></md-focus-ring>`;
  }

  private onLeftClick() {
    const date = this.date;
    if (this.year) {
      date.setFullYear(date.getFullYear() - 1);
    } else {
      date.setMonth(date.getMonth() - 1);
    }
    this.date = date;
    this.dispatchEvent(new Event('left'));
  }

  private onRightClick() {
    const date = this.date;
    if (this.year) {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    this.date = date;
    this.dispatchEvent(new Event('right'));
  }

  private onCenterClick() {
    this.dispatchEvent(new Event('center'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-date-picker-selector': MdDatePickerSelectorElement;
  }
}
