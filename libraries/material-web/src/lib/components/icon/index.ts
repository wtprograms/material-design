import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './index.scss';

@customElement('md-icon')
export class MdIconElement extends LitElement  {
  static override styles = [style];

  @property({ type: Boolean, reflect: true })
  filled = false;

  @property({ type: Number, reflect: true })
  size: number | null | undefined;

  @property({ type: Boolean, reflect: true, attribute: 'badge-dot' })
  badgeDot = false;

  @property({ type: Number, reflect: true, attribute: 'badge-number' })
  badgeNumber?: number;

  override render() {
    const badge =
      this.badgeNumber || this.badgeDot
        ? html`<md-badge
            ?dot=${this.badgeDot}
            .number=${this.badgeNumber}
          ></md-badge>`
        : nothing;
    return html`<slot></slot> ${badge}`;
  }

  protected override update(changedProperties: Map<PropertyKey, unknown>) {
    super.update(changedProperties);
    if (changedProperties.has('size')) {
      if (this.size) {
        this.style.setProperty('--_size', this.size + '');
      } else {
        this.style.setProperty('--_size', '');
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-icon': MdIconElement;
  }
}
