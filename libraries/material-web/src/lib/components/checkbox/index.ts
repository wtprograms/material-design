import { LitElement, html } from 'lit';
import {
  customElement,
  property,
} from 'lit/decorators.js';
import style from './index.scss';
import { mixinCheck } from '../../common/mixins/check/mixin-check';

const base = mixinCheck(LitElement);

@customElement('md-checkbox')
export class MdCheckboxElement extends base {
  static override styles = [style];

  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  @property({ type: Boolean, attribute: 'three-state' })
  threeState = false;

  @property({ type: Boolean })
  indeterminate = false;

  override get icon() {
    let icon = 'check_box_outline_blank';
    if (this.checked && !this.indeterminate) {
      icon = 'check_box';
    } else if (this.checked && this.indeterminate) {
      icon = 'indeterminate_check_box';
    }
    return icon;
  }

  override render() {
    return html`<div class="container">
        ${this.renderAttachables()}
        ${this.renderIcon(24)}
        <input
          id="input"
          ?checked=${this.checked}
          ?indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          type="checkbox"
          @change=${this.onInputChange}
        />
      </div>
      ${this.renderLabel()}`;
  }

  private onInputChange(event: Event) {
    if (!this.threeState) {
      this.checked = this.inputElement.checked;
      this.indeterminate = false;
      return;
    }
    event.preventDefault();
    if (!this.checked) {
      this.checked = true;
      this.indeterminate = false;
    } else if (this.checked && !this.indeterminate) {
      this.checked = true;
      this.indeterminate = true;
    } else {
      this.checked = false;
      this.indeterminate = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-checkbox': MdCheckboxElement;
  }
}
