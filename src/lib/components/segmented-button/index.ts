import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinBadge, mixinButton, mixinSelected } from '../../common';

const base = mixinButton(mixinSelected(mixinBadge(LitElement)));

@customElement('md-segmented-button')
export class MdSegmentedButtonElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  leading = false;

  @property({ type: Boolean, reflect: true })
  trailing = false;

  @queryAssignedElements({ slot: 'leading', flatten: true })
  private _leadingElements!: HTMLElement[];

  protected override render(): unknown {
    const icon = this.selected
      ? html`<md-icon filled size="18">check</md-icon>`
      : html`<slot
      name="leading"
      @slotchange=${() => (this.leading = !!this._leadingElements.length)}
    ></slot>`;
    return html`${this.renderAttachables()}
      ${icon}
      ${this.renderAnchorOrButton(this.renderContent())}${this.renderBadge(true)}`;
  }

  private renderContent() {
    return html`<slot></slot>`;
  }

  private renderAttachables() {
    return html` <md-focus-ring for=${this.idName} focus-visible></md-focus-ring>
      <md-ripple for=${this.idName} interactive></md-ripple>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-segmented-button': MdSegmentedButtonElement;
  }
}
