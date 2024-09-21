import { html, LitElement, nothing, PropertyValues } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { MdNavigationItemElement } from '../navigation-item';
import { property$, SCREENS } from '../../common';
import { Observable, tap } from 'rxjs';
import { MdSheetElement } from '../sheet';

export type NavigationLayout = 'rail' | 'bar' | 'drawer';

@customElement('md-navigation')
export class MdNavigationElement extends LitElement {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  @property$()
  layout: NavigationLayout = 'bar';
  layout$!: Observable<NavigationLayout>;

  @property({ type: Boolean, reflect: true })
  embedded = false;

  @property({ type: Boolean, reflect: true })
  vertical = false;

  @property({ type: Boolean })
  media = false;

  @queryAssignedElements()
  private _items!: HTMLElement[];

  @query('md-sheet')
  private _sheet!: MdSheetElement;

  get open() {
    return this._sheet?.open ?? false;
  }
  set open(value: boolean) {
    if (this.layout !== 'drawer' || this.embedded) {
      return;
    }
    this._sheet.open = value;
  }

  get items(): MdNavigationItemElement[] {
    return this._items.filter(
      (item): item is MdNavigationItemElement =>
        item instanceof MdNavigationItemElement
    );
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.media) {
      this.updateLayout();
      window.addEventListener('resize', this.updateLayout.bind(this));
    }
  }

  private updateLayout() {
    if (window.matchMedia(`(max-width: ${SCREENS.medium - 1}px)`).matches) {
      this.embedded = false;
      this.layout = 'bar';
    } else if (
      window.matchMedia(
        `(min-width: ${SCREENS.medium}px) and (max-width: ${
          SCREENS.large - 1
        }px)`
      ).matches
    ) {
      this.embedded = false;
      this.layout = 'rail';
    } else if (
      window.matchMedia(`(min-width: ${SCREENS.large}px)`).matches
    ) {
      this.embedded = true;
      this.layout = 'drawer';
    }
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.layout$
      .pipe(
        tap((x) => {
          for (const item of this.items) {
            item.drawer = x === 'drawer';
          }
        })
      )
      .subscribe();
  }

  override render() {
    if (this.layout === 'drawer' && !this.embedded) {
      return html`<md-sheet dock="start">
        <slot @click=${() => (this.open = false)}></slot>
      </md-sheet>`;
    }
    const elevation =
      this.layout === 'bar'
        ? html`<md-elevation level="2"></md-elevation>`
        : nothing;
    return html`${elevation}<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation': MdNavigationElement;
  }
}
