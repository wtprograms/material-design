import { html, LitElement, nothing, PropertyValues } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  queryAssignedNodes,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinButton, property$ } from '../../common';
import { combineLatest, Observable, tap } from 'rxjs';
import { MdIconElement } from '../icon';

const base = mixinButton(LitElement);

@customElement('md-navigation-item')
export class MdNavigationItemElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  selected = false;

  @property({ type: Boolean, reflect: true })
  @property$()
  drawer = false;
  drawer$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true, attribute: 'hide-label' })
  hideLabel = false;

  @property({ type: Boolean, attribute: 'badge-dot' })
  @property$()
  badgeDot = false;
  badgeDot$!: Observable<boolean>;

  @property({ type: Number, attribute: 'badge-number' })
  @property$()
  badgeNumber: number | null = null;
  badgeNumber$!: Observable<number | null>;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private _iconElements!: MdIconElement[];

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    combineLatest({
      dot: this.badgeDot$,
      number: this.badgeNumber$,
      drawer: this.drawer$,
    })
      .pipe(
        tap(({ dot, number, drawer }) => {
          if (!drawer) {
            this._iconElements[0].badgeDot = dot;
            this._iconElements[0].badgeNumber = number;
          } else {
            this._iconElements[0].badgeDot = false;
            this._iconElements[0].badgeNumber = null;
          }
        })
      )
      .subscribe();
  }

  override render() {
    const prefix = html`<slot name="icon"></slot>`;
    const indicator = this.drawer ? nothing : prefix;
    const badge = this.drawer
      ? html`<md-badge
          ?dot=${this.badgeDot}
          number=${this.badgeNumber ?? nothing}
          embedded
        ></md-badge>`
      : nothing;
    const drawer = !this.drawer ? nothing : prefix;
    return html`<div class="indicator">
        <md-focus-ring for="control" focus-visible></md-focus-ring>
        <md-ripple for="control" interactive></md-ripple>${indicator}
      </div>
      ${drawer} ${this.renderAnchorOrButton(this.renderContent())}${badge}`;
  }

  private renderContent() {
    return html`<span class="label"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-item': MdNavigationItemElement;
  }
}
