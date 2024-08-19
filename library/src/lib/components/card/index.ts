import { html, LitElement, nothing } from 'lit';
import {
  customElement,
  property,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinButton, mixinActivatable } from '../../common';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

const base = mixinButton(mixinActivatable(LitElement));

@customElement('md-card')
export class MdCardElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  variant: CardVariant = 'outlined';

  override render() {
    const content = this.activatable
      ? this.renderAnchorOrButton()
      : this.renderContent();
    const attachables = this.activatable
      ? html`<md-ripple
            for="button"
            ?activatable=${this.activatable}
            ?disabled=${this.disabled}
          ></md-ripple>
          <md-focus-ring
            for="button"
            focus-visible
            ?disabled=${this.disabled || !this.activatable}
          ></md-focus-ring>`
      : nothing;
    return html`<div class="container"></div>
      ${this.renderElevation()} ${attachables} ${content}`;
  }

  private renderElevation() {
    const level = this.variant === 'elevated' ? 1 : 0;
    return this.variant !== 'outlined'
      ? html`<md-elevation
          for="button"
          level="${level}"
          activatable
          ?disabled=${this.disabled}
        ></md-elevation>`
      : nothing;
  }

  override renderContent() {
    return html` <slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-card': MdCardElement;
  }
}
