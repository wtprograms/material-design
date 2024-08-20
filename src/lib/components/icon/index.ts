import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';

@customElement('md-icon')
export class MdIconElement extends LitElement {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  filled = false;

  @property({ type: Number, reflect: true })
  get size(): number | null {
    return this._size;
  }
  set size(value: number | null) {
    this._size = value;
    this.updateIconSize();
  }
  private _size: number | null = null;

  @property({ type: Boolean, reflect: true, attribute: 'badge-dot' })
  badgeDot = false;

  @property({ type: Number, reflect: true, attribute: 'badge-number' })
  badgeNumber = 0;

  override connectedCallback() {
    super.connectedCallback();
    this.updateIconSize();
  }

  override render() {
    const badge =
      this.badgeDot || this.badgeNumber > 0
        ? html`<md-badge
            ?dot=${this.badgeDot}
            number=${this.badgeNumber}
          ></md-badge>`
        : nothing;
    return html`<slot></slot> ${badge}`;
  }

  private updateIconSize() {
    if (this._size !== null) {
      this.style.setProperty('--md-comp-icon-size', `${this._size}`);
    } else {
      this.style.removeProperty('--md-comp-icon-size');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-icon': MdIconElement;
  }
}
