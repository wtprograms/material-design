import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styles } from './styles';

@customElement('md-list')
export class MdListElement extends LitElement {
  static override styles = [styles];

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-list': MdListElement;
  }
}
