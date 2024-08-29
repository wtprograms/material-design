import { html, LitElement, nothing, PropertyValues } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinButton, mixinSelectable } from '../../common';
import { MdIconElement } from '../icon';

const base = mixinButton(mixinSelectable(LitElement));

@customElement('md-navigation-item')
export class MdNavigationItemElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true, attribute: 'drawer-item' })
  drawerItem = false;

  @property({ type: Boolean, reflect: true, attribute: 'badge-dot' })
  badgeDot = false;

  @property({ type: Number, reflect: true, attribute: 'badge-number' })
  badgeNumber = 0;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly iconSlots!: MdIconElement[];

  protected override updated(changedProperties: PropertyValues): void {
    if (this.iconSlots.length) {
      if (this.drawerItem) {
        this.iconSlots[0].removeAttribute('badge-dot');
        this.iconSlots[0].removeAttribute('badge-number');
      } else {
        this.iconSlots[0].badgeDot = this.badgeDot;
        this.iconSlots[0].badgeNumber = this.badgeNumber;
      }
    }
    super.updated(changedProperties);
  }

  override render() {
    const icon = this.drawerItem
      ? nothing
      : html`<span class="icon">
          <slot name="icon"></slot>
        </span>`;
    return html`<div class="container">
        <md-ripple
          for=${this.targetId}
          activatable
          ?disabled=${this.disabled}
        ></md-ripple>
        <md-focus-ring
          for=${this.targetId}
          focus-visible
          ?disabled=${this.disabled}
        ></md-focus-ring>
        ${icon}
      </div>
      ${this.renderAnchorOrButton()}`;
  }

  override renderContent(): unknown {
    const icon = !this.drawerItem
      ? nothing
      : html`<span class="icon">
          <slot name="icon"></slot>
        </span>`;
    const badge =
      this.drawerItem && (this.badgeDot || this.badgeNumber)
        ? html`<md-badge
            ?dot=${this.badgeDot}
            number=${this.badgeNumber}
            embedded
          ></md-badge>`
        : nothing;
    return html`${icon} <slot></slot> ${badge}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-item': MdNavigationItemElement;
  }
}
