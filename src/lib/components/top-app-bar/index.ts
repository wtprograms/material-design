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

  @property({ type: Boolean, reflect: true })
  menu = false;

  @queryAssignedElements({ slot: 'menu-item', flatten: true })
  private readonly menuItemSlots!: HTMLElement[];

  override render() {
    return html`
      <slot name="leading"></slot>
      <span class="headline">
        <slot name="headline"></slot>
      </span>
      <div class="body">
        <slot name="body"></slot>
      </div>
      <div class="trailing">
        <div class="actions">
          <slot name="action"></slot>
        </div>
        <div class="menu">
          <md-icon-button id="menu">
            <md-icon>more_vert</md-icon>
          </md-icon-button>
          <md-menu for="menu" placement="bottom-end">
            <slot
              name="menu-item"
              @slotchange=${this.onMenuItemSlotChange}
            ></slot>
          </md-menu>
        </div>
      </div>
    `;
  }

  private onMenuItemSlotChange() {
    this.menu = this.menuItemSlots.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-top-app-bar': MdTopAppBarElement;
  }
}
