import { html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { styles } from './styles';
import { MdNavigationItemElement } from '../navigation-item';

export type NavigationLayout = 'bar' | 'rail' | 'drawer';

@customElement('md-navigation')
export class MdNavigationElement extends LitElement {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  layout: NavigationLayout = 'bar';

  @queryAssignedElements({ flatten: true })
  private readonly _slots!: HTMLElement[];

  get navigationItems(): MdNavigationItemElement[] {
    return this._slots.filter(
      (el): el is MdNavigationItemElement => el instanceof MdNavigationItemElement
    );
  }

  protected override updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);
    this.updateLayout();
  }

  override render() {
    const elevation = this.layout === 'bar' ? html`<md-elevation level="2"></md-elevation>` : nothing;
    return html`${elevation} <slot @slotchange=${this.updateLayout}></slot>`;
  }

  private updateLayout() {
    for (const item of this.navigationItems) {
      item.drawerItem = this.layout === 'drawer';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation': MdNavigationElement;
  }
}
