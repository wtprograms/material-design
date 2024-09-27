import {  html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styles } from './styles';
import { ObservableElement } from '../../common';

@customElement('md-breadcrumb')
export class MdBreadcrumbElement extends ObservableElement {
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
