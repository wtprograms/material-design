import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { CheckType, mixinCheck } from '../../common';

const base = mixinCheck(LitElement);

@customElement('md-segmented-button')
export class MdSegmentedButtonElement extends base {
  static override styles = [styles];

  @property({ type: String })
  type: CheckType = 'checkbox';

  @property({ type: Boolean, reflect: true, attribute: 'has-icon' })
  hasIcon = false;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly iconSlotElements!: HTMLElement[];

  protected override render(): unknown {
    return html`
      ${this.renderRipple()}
      ${this.renderFocusRing()}
      ${this.renderInput(this.type)}
      ${this.renderContent()}`;
  }

  private renderContent() {
    const icon = this.checked
      ? html`<md-icon>check</md-icon>`
      : html`<slot name="icon" @slotchange=${this.onIconSlotChange}></slot>`;
    return html` ${icon}
      <slot></slot>`;
  }

  private onIconSlotChange() {
    this.hasIcon = this.iconSlotElements.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-segmented-button': MdSegmentedButtonElement;
  }
}
