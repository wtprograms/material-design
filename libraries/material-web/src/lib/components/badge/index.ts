import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './index.scss';

@customElement('md-badge')
export class MdBadgeElement extends LitElement {
  static override styles = [style];

  @property({ type: Boolean, reflect: true })
  dot = false;

  @property({ type: Number, reflect: true })
  number?: number;

  @property({ type: Boolean, reflect: true, attribute: 'single-digit'})
  singleDigit?: boolean;

  @property({ type: Boolean, reflect: true })
  embedded = false;

  override connectedCallback() {
    super.connectedCallback();
    this.updateSingleDigit();
  }

  private updateSingleDigit() {
    this.singleDigit = !!this.number && this.number < 10;
  }

  protected override update(changedProperties: Map<PropertyKey, unknown>) {
    super.update(changedProperties);
    if (changedProperties.has('number')) {
      this.updateSingleDigit();
    }
  }

  override render() {
    if (!this.number) {
      return nothing;
    }

    const number = this.number > 999 ? '999+' : this.number + '';
    return html`${number}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-badge': MdBadgeElement;
  }
}
