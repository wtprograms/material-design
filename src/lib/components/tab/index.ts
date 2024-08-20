import { html, LitElement, nothing, PropertyValues } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { MdIconElement } from '../icon';
import { mixinButton, mixinSelectable } from '../../common';

const base = mixinButton(mixinSelectable(LitElement));

@customElement('md-tab')
export class MdTabElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  secondary = false;

  @property({ type: Boolean, reflect: true, attribute: 'badge-dot' })
  badgeDot = false;

  @property({ type: Number, reflect: true, attribute: 'badge-number' })
  badgeNumber = 0;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  readonly iconSlots!: MdIconElement[];

  @queryAssignedElements({ flatten: true })
  readonly slots!: MdIconElement[];

  @query('.text')
  readonly text!: HTMLSpanElement;

  protected override updated(changedProperties: PropertyValues): void {
    if (this.iconSlots.length) {
      if (this.secondary) {
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
    return html`<div class="container"></div>
      <md-focus-ring
        for="button"
        focus-visible
        ?disabled=${this.disabled}
      ></md-focus-ring>
      ${this.renderAnchorOrButton()}`;
  }

  override renderContent(): unknown {
    const badge =
      this.secondary && (this.badgeDot || this.badgeNumber)
        ? html`<md-badge
            ?dot=${this.badgeDot}
            number=${this.badgeNumber}
            embedded
          ></md-badge>`
        : nothing;
    return html`<span class="icon"> <slot name="icon"></slot> </span
      ><span class="text"><slot></slot></span> ${badge}`;
  }

  override handleActivationClick(event: MouseEvent) {
    super.handleActivationClick(event);
    this.selected = true;
    return true;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-tab': MdTabElement;
  }
}
