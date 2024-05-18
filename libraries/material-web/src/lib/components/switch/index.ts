import { LitElement, TemplateResult, html, nothing } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import style from './index.scss';
import { mixinCheck } from '../../common/mixins/check/mixin-check';

const base = mixinCheck(LitElement);

@customElement('md-switch')
export class MdSwitchElement extends base {
  static override styles = [style];

  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  @queryAssignedElements({ slot: 'unchecked', flatten: true })
  private readonly _uncheckedSlots!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-unchecked-icon' })
  hasUncheckedIcon = false;

  override render() {
    return html`<div class="track">
        <div class="handle-container">
          ${this.renderAttachables()}
          <div class="handle">${this.renderIcon()}</div>
        </div>
        <input
          id="input"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          type="checkbox"
          @change=${this.onInputChange}
        />
      </div>
      ${this.renderLabel()}`;
  }

  private onInputChange() {
    this.checked = this.inputElement.checked;
  }

  override renderIcon(): TemplateResult | typeof nothing {
    return html`<slot name="unchecked" ?hidden="${this.checked}" @slotchange=${this.onSlotChange}></slot
      ><slot name="checked" ?hidden="${!this.checked}"></slot>`;
  }
  
  override onSlotChange() {
    super.onSlotChange();
    this.hasUncheckedIcon = this._uncheckedSlots.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-switch': MdSwitchElement;
  }
}
