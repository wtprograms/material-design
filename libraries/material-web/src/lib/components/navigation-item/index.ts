import { LitElement, html, nothing } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import style from './index.scss';
import { mixinSelectable, mixinButton } from '../../common';
import { MdIconElement } from '../icon';

const base = mixinSelectable(mixinButton(LitElement));

@customElement('md-navigation-item')
export class MdNavigationItemElement extends base {
  static override styles = [style];

  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  @property({ type: Boolean, reflect: true })
  drawer = false;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly _iconSlots!: HTMLElement[];

  get icons(): MdIconElement[] {
    return this._iconSlots.filter(
      (el) => el instanceof MdIconElement
    ) as MdIconElement[];
  }

  @state()
  private _hasIcon = false;

  @state()
  private _hasBadge = false;

  @property({ type: Boolean, reflect: true, attribute: 'badge-dot' })
  badgeDot = false;

  @property({ type: Number, reflect: true, attribute: 'badge-number' })
  badgeNumber?: number;

  override connectedCallback() {
    super.connectedCallback();
    this.updateBadge();
  }

  override updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);
    if (
      changedProperties.has('badgeNumber') ||
      changedProperties.has('badgeDot')
    ) {
      this.updateBadge();
    }
  }

  private updateBadge() {
    this._hasBadge = this.badgeNumber !== undefined || this.badgeDot;
    if (!this.drawer) {
      for (const icon of this.icons) {
        icon.badgeDot = this.badgeDot;
        icon.badgeNumber = this.badgeNumber;
      }
    }
  }

  override render() {
    const badge =
      this._hasBadge && this.drawer
        ? html`<md-badge
            ?dot=${this.badgeDot}
            .number=${this.badgeNumber}
            embedded
          ></md-badge>`
        : nothing;
    return html` ${this.renderContainer()} ${this.renderAnchorOrButton()}
    ${badge}`;
  }

  private renderContainer() {
    const icon = html`<slot
      class="icon"
      ?hidden=${!this._hasIcon}
      name="icon"
      @slotchange=${this.onSlotChange}
    ></slot>`;
    return !this.drawer
      ? html`<div class="container">${this.renderAttachables()} ${icon}</div>`
      : html`<div class="container"></div>
          ${this.renderAttachables()} ${icon}`;
  }

  private renderAttachables() {
    return html`<md-focus-ring
        for="button"
        focus-visible
        ?disabled=${this.disabled}
      ></md-focus-ring>
      <md-ripple for="button" hoverable activatable ?disabled=${this.disabled}>
      </md-ripple>`;
  }

  private onSlotChange() {
    this._hasIcon = this._iconSlots.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-item': MdNavigationItemElement;
  }
}
