import '../elevation';
import '../focus-ring';
import '../ripple';
import '../progress-indicator';
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
          for="control"
          ?interactive=${this.interactive}
          level=${level}
        ></md-elevation>`
      : nothing;
    return this.interactive
      ? html`${elevation}${this.renderAttachables()}${this.renderAnchorOrButton(nothing)}${this.renderContent()}`
      : html`${elevation}${this.renderContent()}`;
  }

  private renderContent() {
    return html`<slot></slot>`;
  }

  private renderAttachables() {
    return html`
      <md-focus-ring for="control" focus-visible></md-focus-ring>
      <md-ripple for="control" interactive></md-ripple>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-card': MdCardElement;
  }
}
