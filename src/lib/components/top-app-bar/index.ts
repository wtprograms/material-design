import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';

@customElement('md-top-app-bar')
export class MdTopAppBarElement extends LitElement {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true, attribute: 'has-leading' })
  hasLeading = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-trailing' })
  hasTrailing = false;

  @queryAssignedElements({ slot: 'leading', flatten: true })
  private _leadingSlots!: HTMLElement[];

  @queryAssignedElements({ slot: 'trailing', flatten: true })
  private _trailingSlots!: HTMLElement[];

  override render() {
    return html`
      <slot name="leading" @slotchange=${this.onSlotChange}></slot>
      <div class="body">
        <slot></slot>
      </div>
      <div class="trailing">
        <slot name="trailing" @slotchange=${this.onSlotChange}></slot>
      </div>
    `;
  }

  private onSlotChange() {
    this.hasLeading = this._leadingSlots.length > 0;
    this.hasTrailing = this._trailingSlots.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-top-app-bar': MdTopAppBarElement;
  }
}
