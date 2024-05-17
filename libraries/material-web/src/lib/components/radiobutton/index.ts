import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './index.scss';
import { mixinCheck } from '../../common/mixins/check/mixin-check';

const base = mixinCheck(LitElement);

@customElement('md-radiobutton')
export class MdRadiobuttonElement extends base {
  static override styles = [style];

  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  override get icon() {
    return this.checked ? 'radio_button_checked' : 'radio_button_unchecked';
  }

  override render() {
    return html`<div class="container">
        ${this.renderAttachables()} ${this.renderIcon(24)}
        <input
          id="input"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          type="radio"
          @change=${this.onInputChange}
        />
      </div>
      ${this.renderLabel()}`;
  }

  private onInputChange() {
    this.checked = this.inputElement.checked;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-radiobutton': MdRadiobuttonElement;
  }
}
