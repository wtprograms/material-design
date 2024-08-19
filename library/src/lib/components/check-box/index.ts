import { html, LitElement } from 'lit';
import {
  customElement,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinCheck } from '../../common';

const base = mixinCheck(LitElement);

@customElement('md-check-box')
export class MdCheckBoxElement extends base {
  static override styles = [styles];

  get icon(): string {
    if (!this.checked) {
      return 'check_box_outline_blank';
    } else if (this.checked && !this.indeterminate) {
      return 'check_box';
    } else {
      return 'indeterminate_check_box';
    }
  }

  protected override render(): unknown {
    return html`<div class="container">
      ${this.renderRipple()}
      ${this.renderFocusRing()}
      <md-icon ?filled=${this.checked}>${this.icon}</md-icon>
    </div>
    ${this.renderInput('checkbox')}
    ${this.renderLabel()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-check-box': MdCheckBoxElement;
  }
}
