import { LitElement, html, nothing } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import style from './index.scss';
import { NavigationLayout } from './navigation-layout';
import { MdNavigationItemElement } from '../navigation-item';

@customElement('md-navigation')
export class MdNavigationElement extends LitElement {
  static override styles = [style];

  @property({ type: String, reflect: true })
  layout: NavigationLayout = 'bar';

  @queryAssignedElements({ flatten: true })
  private readonly _slots!: HTMLElement[];

  get items(): MdNavigationItemElement[] {
    return this._slots.filter(
      (el) => el instanceof MdNavigationItemElement
    ) as MdNavigationItemElement[];
  }

  override connectedCallback() {
    super.connectedCallback();
    this.updateLayout();
  }

  override render() {
    const elevation = this.layout === 'bar' ? html`<md-elevation level="2"></md-elevation>` : nothing;
    return html`<div class="container"></div>${elevation} <slot></slot>`;
  }

  protected override update(changedProperties: Map<PropertyKey, unknown>) {
    super.update(changedProperties);
    if (changedProperties.has('layout')) {
      this.updateLayout();
    }
  }

  private updateLayout() {
    for (const item of this.items) {
      item.drawer = this.layout === 'drawer';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation': MdNavigationElement;
  }
}
