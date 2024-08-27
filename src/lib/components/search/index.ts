import { html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styles } from './styles';
import { mixinAttachablePopover, mixinPopup } from '../../common';
import { MdPopoverElement } from '../popover';

@customElement('md-search')
export class MdSearchElement extends LitElement {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true, attribute: 'has-menu' })
  hasMenu = false;

  @property({ type: Boolean, reflect: true })
  fullscreen = false;

  @query('.input')
  private _input!: HTMLInputElement;

  @query('.popup')
  private _popup?: MdPopoverElement;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean, reflect: true })
  opening = false;

  @property({ type: String })
  get value(): string {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
    this.dispatchEvent(new Event('value-change', { bubbles: true }));
  }
  private _value = '';

  @query('#popover')
  private _popover!: MdPopoverElement;

  override render() {
    const menu =
      this.hasMenu && !this.open
        ? html`<md-icon-button class="menu" @click=${this.onMenu}>
            <md-icon>menu</md-icon>
          </md-icon-button>`
        : nothing;
    const back = this.fullscreen
      ? html`<md-icon-button class="back" @click=${this.onBack}>
          <md-icon>arrow_back</md-icon>
        </md-icon-button>`
      : nothing;
    const elevation = this.opening || this.open ? 2 : 0;
    return html`
      <div id="body" class="body">
        <div class="container">
        <md-elevation level="${elevation}"></md-elevation>
        </div>
        ${menu} ${back}
        <div class="content">
          <slot></slot>
        </div>
        <input
          id="input"
          class="input"
          @focus=${this.onFocus}
          @input=${this.onInput}
        />
        <slot name="avatar"></slot>
      </div>
      <md-popover
        id="popover"
        for="body"
        @position-changed=${this.positionChanged}
        offset="0"
        class="popup"
        trigger="manual"
        adjust-plugins=""
        @opened=${this.openToggled}
        @opening=${this.openingToggled}
        @closed=${this.openToggled}
      >
        <slot name="popover"></slot>
        <slot name="item"></slot>
      </md-popover>
    `;
  }

  private positionChanged() {
    this._popover.style.setProperty('--md-comp-popup-width', `${this.offsetWidth}px`);
    this._popover.style.height = '';
    if (this.fullscreen) {
      this._popover.style.height = (this.parentElement!.offsetHeight - this.offsetHeight) + 'px';
    }
  }

  private onInput() {
    this.value = this._input.value;
  }

  private openingToggled() {
    this.opening = this._popup!.opening;
  }

  private openToggled() {
    this.open = this._popup!.open;
    this.opening = false;
    if (!this.open) {
      this._input.value = this.value = '';
    }
  }

  private onMenu() {
    this.dispatchEvent(new Event('menu', { bubbles: true }));
  }

  private onFocus() {
    this._popup!.open = true;
  }

  private onBack() {
    this._popup!.open = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-search': MdSearchElement;
  }
}
