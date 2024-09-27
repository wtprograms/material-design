import {  html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styles } from './styles';
import { ObservableElement } from '../../common';

@customElement('md-list')
export class MdListElement extends ObservableElement {
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
