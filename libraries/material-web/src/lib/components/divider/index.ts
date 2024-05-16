import { LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './index.scss';

@customElement('md-divider')
export class MdDividerElement extends LitElement {
  static override styles = [style];

  @property({ type: Boolean, reflect: true})
  vertical = false;

  override render() {
    return nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-divider': MdDividerElement;
  }
}
