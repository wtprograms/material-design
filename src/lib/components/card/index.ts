import { html, LitElement, nothing } from 'lit';
import {
  customElement,
  property,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinButton } from '../../common';

export type CardVariant =
  | 'elevated'
  | 'filled'
  | 'outlined';

const base = mixinButton(LitElement);

@customElement('md-card')
export class MdCardElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  variant: CardVariant = 'outlined';

  @property({ type: Boolean, reflect: true })
  interactive = false;

  protected override render(): unknown {
    const elevatedVariants: CardVariant[] = ['elevated', 'filled'];
    const level = this.variant === 'elevated' ? 1 : 0;
    const elevation = elevatedVariants.includes(this.variant)
      ? html`<md-elevation
          for=${this.idName}
          ?interactive=${this.interactive || !!this.href}
          level=${level}
        ></md-elevation>`
      : nothing;
    return this.interactive || !!this.href
      ? html`${elevation}${this.renderAttachables()}${this.renderAnchorOrButton(nothing)}${this.renderContent()}`
      : html`${elevation}${this.renderContent()}`;
  }

  private renderContent() {
    return html`<div class="container"><slot></slot></div>`;
  }

  private renderAttachables() {
    return html`
      <md-focus-ring for=${this.idName} focus-visible></md-focus-ring>
      <md-ripple for=${this.idName} interactive></md-ripple>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-card': MdCardElement;
  }
}
