import { html, LitElement } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import { styles } from './styles';

@customElement('md-breadcrumb')
export class MdBreadcrumbElement extends LitElement {
  static override styles = [styles];

  @queryAssignedElements({ flatten: true })
  private _slots!: HTMLElement[];

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-breadcrumb': MdBreadcrumbElement;
  }
}
