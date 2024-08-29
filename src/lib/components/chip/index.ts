import { LitElement, html, nothing } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinButton, mixinSelectable } from '../../common';

const base = mixinButton(mixinSelectable(LitElement));

@customElement('md-chip')
export class MdChipElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true, attribute: 'has-icon' })
  hasIcon = false;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly iconSlotElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-trailing' })
  hasTrailing = false;

  @queryAssignedElements({ slot: 'trailing', flatten: true })
  private readonly trailingSlotElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true })
  pill = false;

  @property({ type: Boolean, reflect: true })
  closable = false;

  protected override render(): unknown {
    if (this.closable) {
      return html`
        ${this.renderContent()}
        <button id="button" class="close-button">
          <md-icon size="18">close</md-icon>
          ${this.renderAttachables()}
        </button>`;
    }
    return html`
      ${this.renderAttachables()} ${this.renderAnchorOrButton()}`;
  }

  private renderAttachables() {
    return html`<md-ripple
        for="button"
        activatable
        ?disabled=${this.disabled}
      ></md-ripple>
      <md-focus-ring
        for="button"
        focus-visible
        ?disabled=${this.disabled}
      ></md-focus-ring>`;
  }

  override renderContent() {
    return html` <slot name="icon" @slotchange=${this.onSlotChange}></slot>
      <slot></slot>
      <slot name="trailing" @slotchange=${this.onSlotChange}></slot>`;
  }

  private onSlotChange() {
    this.hasIcon = this.iconSlotElements.length > 0;
    this.hasTrailing = this.trailingSlotElements.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-chip': MdChipElement;
  }
}
