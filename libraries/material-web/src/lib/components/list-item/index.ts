import { LitElement, html, nothing } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import style from './index.scss';
import { mixinActivatable, mixinButton, mixinSelectable } from '../../common';
import { MdFocusRingElement } from '../focus-ring';
import { MdRippleElement } from '../ripple';

const base = mixinSelectable(mixinActivatable(mixinButton(LitElement)));

@customElement('md-list-item')
export class MdListItemElement extends base {
  static override styles = [style];

  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  @property({ type: Boolean, reflect: true, attribute: 'has-leading' })
  hasLeading = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-trailing' })
  hasSupportingText = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-trailing' })
  hasTrailing = false;

  @property({ type: Boolean, reflect: true })
  large = false;

  @property({ type: Boolean, reflect: true })
  start = false;

  @queryAssignedElements({ slot: 'leading' })
  private _leadingElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'supporting-text' })
  private _supportingTextElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'trailing' })
  private _trailingElements!: HTMLElement[];

  @query('md-focus-ring')
  private _focusRing?: MdFocusRingElement;

  @query('md-ripple')
  private _ripple?: MdRippleElement;

  override render() {
    const content = this.activatable
      ? this.buttonContent()
      : this.renderContent();
    return html`<div class="container"></div>
      ${content}`;
  }

  private buttonContent() {
    return html`
    <md-focus-ring for="button" focus-visible ?disabled=${!this
      .activatable}></md-focus-ring></md-focus-ring
      ><md-ripple for="button" hoverable activatable ?disabled=${!this
        .activatable}></md-ripple>
    ${this.renderAnchorOrButton()}`;
  }

  override renderContent() {
    const touch = this.activatable ? html`<div class="touch"></div>` : nothing;
    return html`${touch}
      <slot
        name="leading"
        class="leading"
        ?hidden=${!this.hasLeading}
        @slotchange=${this.onSlotChange}
      ></slot>
      <div class="content">
        <slot></slot>
        <slot
          name="supporting-text"
          class="supporting-text"
          ?hidden=${!this.hasSupportingText}
          @slotchange=${this.onSlotChange}
        ></slot>
      </div>
      <slot
        name="trailing"
        class="trailing"
        ?hidden=${!this.hasLeading}
        @slotchange=${this.onSlotChange}
      ></slot> `;
  }

  private onSlotChange() {
    this.hasLeading = this._leadingElements.length > 0;
    this.hasSupportingText = this._supportingTextElements.length > 0;
    this.hasTrailing = this._trailingElements.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-list-item': MdListItemElement;
  }
}
