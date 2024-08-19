import { html, LitElement } from 'lit';
import {
  customElement,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinCheck } from '../../common';

const base = mixinCheck(LitElement);

@customElement('md-radio-button')
export class MdRadioButtonElement extends base {
  static override styles = [styles];

  get icon(): string {
    if (!this.checked) {
      return 'radio_button_unchecked';
    } else {
      return 'radio_button_checked';
    }
  }

  protected override render(): unknown {
    return html`<div class="container">
      ${this.renderRipple()}
      ${this.renderFocusRing()}
      <md-icon ?filled=${this.checked}>${this.icon}</md-icon>
    </div>
    ${this.renderInput('radio')}
    ${this.renderLabel()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-radio-button': MdRadioButtonElement;
  }
}
