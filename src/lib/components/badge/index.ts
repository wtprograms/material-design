import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';

@customElement('md-badge')
export class MdBadgeElement extends LitElement {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  dot = false;

  @property({ type: Number, reflect: true })
  number: number | null = null;

  @property({ type: Boolean, reflect: true })
  embedded = false;

  @property({ type: Boolean, reflect: true, attribute: 'single-digit' })
  singleDigit = this.number !== null && this.number < 10;

  override render() {
    if (this.dot || !this.number) {
      return nothing;
    }
    const content = this.number > 999 ? '999+' : this.number;
    return html`${content}`;
  }

  protected override update(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('number')) {
      this.singleDigit = this.number !== null && this.number < 10;
    }
    super.update(changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-badge': MdBadgeElement;
  }
}
