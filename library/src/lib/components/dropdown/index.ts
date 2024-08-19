import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { MdListItemElement } from '../list-item';
import { mixinDropdown } from '../../common';

const base = mixinDropdown(LitElement);

@customElement('md-dropdown')
export class MdDropdownElement extends base {
  static override styles = [styles];

  @queryAssignedElements({ slot: 'item', flatten: true })
  private readonly _itemSlots!: HTMLElement[];

  get items(): MdListItemElement[] {
    return this._itemSlots.filter(
      (x) => x instanceof MdListItemElement
    ) as MdListItemElement[];
  }

  @property({ type: Boolean, reflect: true, attribute: 'has-items' })
  hasItems = false;

  override renderPopupContent(): unknown {
      return html`<md-list>
      <slot
        name="item"
        @slotchange=${this.onItemSlotChange}
        @click=${this.onItemClick}
      ></slot>
    </md-list>`;
  }

  private onItemClick(event: Event): void {
    const item = event.target as MdListItemElement;
    if (item.value) {
      this.value = item.value === 'null' ? null : item.value;

      for (const listItem of this.items) {
        listItem.selected = listItem.value === this.value;
      }
    }
    setTimeout(() => this.popup?.close(), 100);
  }

  private onItemSlotChange() {
    this.hasItems = this.items.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-dropdown': MdDropdownElement;
  }
}
