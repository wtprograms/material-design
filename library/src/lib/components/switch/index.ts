import { html, LitElement } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { styles } from './styles';
import { mixinCheck } from '../../common';

const base = mixinCheck(LitElement);

@customElement('md-switch')
export class MdSwitchElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true, attribute: 'has-unchecked-icon' })
  hasUncheckedIcon = false;

  @queryAssignedElements({ slot: 'unchecked-icon', flatten: true })
  private _uncheckedIconSlots!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-checked-icon' })
  hasCheckedIcon = false;

  @queryAssignedElements({ slot: 'checked-icon', flatten: true })
  private _checkedIconSlots!: HTMLElement[];

  override render() {
    return html`<div class="track">
        <div class="container">
          ${this.renderFocusRing()} ${this.renderRipple()}
          <div class="handle">
            <span class="unchecked-icon">
              <slot name="unchecked-icon" @slotchange=${this.updateIconSlots}></slot>
            </span>
            <span class="checked-icon">
              <slot name="checked-icon" @slotchange=${this.updateIconSlots}></slot>
            </span>
          </div>
        </div>
      </div>
      ${this.renderLabel()} ${this.renderInput('checkbox')}`;
  }

  private updateIconSlots(): void {
    this.hasUncheckedIcon = this._uncheckedIconSlots.length > 0;
    this.hasCheckedIcon = this._checkedIconSlots.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-switch': MdSwitchElement;
  }
}
