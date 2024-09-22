import {  html, LitElement, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styles } from './styles';

@customElement('md-breadcrumb')
export class MdBreadcrumbElement extends LitElement {
  static override styles = [styles];

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-breadcrumb': MdBreadcrumbElement;
  }
}
