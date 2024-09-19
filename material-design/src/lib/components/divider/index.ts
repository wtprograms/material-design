import {  LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';

@customElement('md-divider')
export class MdDividerElement extends LitElement {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  variant = false;

  @property({ type: Boolean, reflect: true })
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
