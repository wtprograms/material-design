import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './index.scss';

@customElement('md-navigation-headline')
export class MdNavigationHeadlineElement extends LitElement  {
  static override styles = [style];

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-headline': MdNavigationHeadlineElement;
  }
}
