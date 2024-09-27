import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinButton, ObservableElement } from '../../common';
import { mixinSelected } from '../../common/mixins/mixin-selected';

const base = mixinButton(mixinSelected(ObservableElement));

@customElement('md-chip')
export class MdChipElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true, attribute: 'icon' })
  icon = false;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly iconSlotElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'trailing' })
  trailing = false;

  @queryAssignedElements({ slot: 'trailing', flatten: true })
  private readonly trailingSlotElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true })
  pill = false;

  @property({ type: Boolean, reflect: true })
  closable = false;

  protected override render(): unknown {
    if (this.closable) {
      return html` ${this.renderContent()}
        <md-button
          variant="plain"
          @click=${() =>
            this.dispatchEvent(new Event('close', { bubbles: true }))}
        >
          <md-icon size="18">close</md-icon>
        </md-button>`;
    }
    return html` ${this.renderAttachables()}
    ${this.renderAnchorOrButton(this.renderContent())}`;
  }

  private renderAttachables() {
    return html`<md-ripple
        for="control"
        interactive
      ></md-ripple>
      <md-focus-ring
        for="control"
        focus-visible
      ></md-focus-ring>`;
  }

  private renderContent() {
    return html` <slot name="icon" @slotchange=${this.onSlotChange}></slot>
      <slot></slot>
      <slot name="trailing" @slotchange=${this.onSlotChange}></slot>`;
  }

  private onSlotChange() {
    this.icon = this.iconSlotElements.length > 0;
    this.trailing = this.trailingSlotElements.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-chip': MdChipElement;
  }
}
