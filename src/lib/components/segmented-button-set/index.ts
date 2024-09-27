import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styles } from './styles';
import { ObservableElement } from '../../common';

@customElement('md-segmented-button-set')
export class MdSegmentedButtonSetElement extends ObservableElement {
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
