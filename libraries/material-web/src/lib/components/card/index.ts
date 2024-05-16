import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './index.scss';
import { mixinActivatable, mixinButton } from '../../common';
import { CardVariant } from './card-variant';

const base = mixinActivatable(mixinButton(LitElement));

@customElement('md-card')
export class MdCardElement extends base {
  static override styles = [style];

  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  @property({ type: String, reflect: true })
  variant: CardVariant = 'outlined';

  override render() {
    if (!this.activatable) {
      const elevation =
        this.variant === 'outlined' || this.disabled
          ? nothing
          : html`<md-elevation
              level=${this.variant === 'elevated' ? 1 : 0}
              ?disabled=${this.disabled}
            ></md-elevation>`;
      return html`<div class="container"></div>
        ${elevation}
        <slot></slot>`;
    } else {
      const elevation =
        this.variant === 'outlined' || this.disabled
          ? nothing
          : html`<md-elevation for="button"
              level=${this.variant === 'elevated' ? 1 : 0}
              ?disabled=${this.disabled}
              hoverable
              activatable
            ></md-elevation>`;

      return html`<div class="container"></div>
        ${elevation}
        <md-focus-ring
          for="button"
          focus-visible
          ?disabled=${!this.activatable}
        ></md-focus-ring>
        <md-ripple
          for="button"
          hoverable
          activatable
          ?disabled=${!this.activatable}
        ></md-ripple>
        ${this.renderAnchorOrButton()}`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-card': MdCardElement;
  }
}
