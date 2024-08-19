import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styles } from './styles';

@customElement('md-segmented-button-set')
export class MdSegmentedButtonSetElement extends LitElement {
  static override styles = [styles];

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-segmented-button-set': MdSegmentedButtonSetElement;
  }
}
