import { html, LitElement, PropertyValues } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinButton } from '../../common';
import { MdMenuElement } from '../menu';
import { mixinSelected } from '../../common/mixins/mixin-selected';

const base = mixinButton(mixinSelected(LitElement));

@customElement('md-menu-item')
export class MdMenuItemElement extends base {
  static override styles = [styles];

  @queryAssignedElements({ slot: 'item' })
  private _items!: HTMLElement[];

  @query('md-menu')
  private _menu!: MdMenuElement;

  @state()
  private _hasItems = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.handleActivationClick.bind(this));
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this._menu.attachControl(this);
  }

  protected override render(): unknown {
    return html`${this.renderAttachables()}
      <slot name="leading"></slot>
      ${this.renderAnchorOrButton(this.renderContent())}
      ${this.renderTrailing()}
      <md-menu placement="right-start" offset="0" trigger="manual">
        <slot
          name="item"
          @slotchange=${() => (this._hasItems = !!this._items.length)}
        ></slot>
      </md-menu>`;
  }

  private renderTrailing() {
    return this._hasItems
      ? html`<md-icon>arrow_right</md-icon>`
      : html`<slot name="trailing"></slot>`;
  }

  private renderContent() {
    return html`<slot></slot>`;
  }

  private renderAttachables() {
    return html` <md-focus-ring for="control" focus-visible></md-focus-ring>
      <md-ripple for="control" interactive></md-ripple>`;
  }

  private handleActivationClick(): void {
    if (this._items.length) {
      this._menu.openMenu();
      return;
    }
    this.dispatchEvent(new Event('close-popover', { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-menu-item': MdMenuItemElement;
  }
}
