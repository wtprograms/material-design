import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import {
  internals,
  mixinButton,
  mixinElementInternals,
  mixinSelectable,
  setupFormSubmitter,
} from '../../common';
import style from './index.scss';
import { IconButtonVariant } from './icon-button-variant';
import { MdIconElement } from '../icon';

const base = mixinSelectable(mixinButton(mixinElementInternals(LitElement)));

@customElement('md-icon-button')
export class MdIconButtonElement extends base {
  static override styles = [style];

  static {
    setupFormSubmitter(MdIconButtonElement);
  }

  static readonly formAssociated = true;

  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  @property({ type: String, reflect: true })
  variant: IconButtonVariant = 'standard';

  @queryAssignedElements({ flatten: true })
  private readonly _slots!: HTMLElement[];

  get form() {
    return this[internals].form;
  }

  @property({ type: Boolean, reflect: true, attribute: 'badge-dot' })
  badgeDot = false;

  @property({ type: Number, reflect: true, attribute: 'badge-number' })
  badgeNumber?: number;

  get icons(): MdIconElement[] {
    return this._slots.filter(
      (el) => el instanceof MdIconElement
    ) as MdIconElement[];
  }

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
    for (const icon of this.icons) {
      icon.badgeDot = this.badgeDot;
      icon.badgeNumber = this.badgeNumber;
    }
  }

  override render() {
    return html` <div class="container"></div>
      <md-focus-ring
        for="button"
        focus-visible
        ?disabled=${this.disabled}
      ></md-focus-ring>
      <md-ripple for="button" hoverable activatable ?disabled=${this.disabled}>
      </md-ripple>
      ${this.renderAnchorOrButton()}`;
  }

  override renderContent(): TemplateResult {
    return html`
      <div class="touch"></div>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-icon-button': MdIconButtonElement;
  }
}
