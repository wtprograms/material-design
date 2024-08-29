import { html, LitElement, nothing } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { MdPopoverElement } from '../popover';
import { redispatchEvent } from '../../common';

@customElement('md-search')
export class MdSearchElement extends LitElement {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean, reflect: true })
  populated = false;

  @property({ type: String })
  placeholder = '';

  @property({ type: Boolean, reflect: true, attribute: 'has-items' })
  hasItems = false;

  @queryAssignedElements({ slot: 'item', flatten: true })
  private _itemSlots!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-body' })
  hasBody = false;

  @queryAssignedElements({ slot: 'body', flatten: true })
  private _bodySlots!: HTMLElement[];

  @query('.input')
  private _input!: HTMLInputElement;

  @query('#container')
  private _container!: HTMLElement;

  @query('.popover')
  private _popover!: MdPopoverElement;

  @property({ type: Boolean, reflect: true })
  searching = false;

  override render() {
    return html`<div id="container" class="container">
        <md-elevation level="${this.open ? 2 : 0}"></md-elevation>
        <md-ripple for="container" hoverable></md-ripple>
        <div class="body">
          <md-icon>search</md-icon>
          <input
            class="input"
            @focus=${this.onFocus}
            placeholder=${this.placeholder}
            @input=${this.onInput}
          />
        </div>
      </div>
      <md-popover
        for="container"
        class="popover"
        offset="0"
        .open=${this.open}
        adjust-plugins=""
        @position-changed=${this.onPositionChanged}
        @closed=${this.onPopoverClosed}
      >
        <md-progress-indicator
          variant="linear"
          indeterminate
        ></md-progress-indicator>
        <div class="popover-content">
          <slot name="body" @slotchange=${this.onSlotChange}></slot>
        </div>
        <md-list>
          <slot name="item" @slotchange=${this.onSlotChange}></slot>
        </md-list>
      </md-popover>`;
  }

  private onInput(event: InputEvent) {
    redispatchEvent(this, event);
  }

  private onPositionChanged() {
    this._popover.style.width = `${this._container.clientWidth}px`;
  }

  private onFocus() {
    this.open = true;
  }

  private onPopoverClosed() {
    this.open = false;
  }

  private onSlotChange() {
    this.hasItems = this._itemSlots.length > 0;
    this.hasBody = this._bodySlots.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-search': MdSearchElement;
  }
}
