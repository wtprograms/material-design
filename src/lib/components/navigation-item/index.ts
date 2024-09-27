import { html, LitElement, nothing, PropertyValues } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinButton, ObservableElement } from '../../common';
import { combineLatest, Observable, tap } from 'rxjs';
import { MdIconElement } from '../icon';
import { mixinSelected } from '../../common/mixins/mixin-selected';
import { mixinBadge } from '../../common/mixins/mixin-badge';

const base = mixinButton(mixinSelected(mixinBadge(ObservableElement)));

@customElement('md-navigation-item')
export class MdNavigationItemElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  drawer = false;
  drawer$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true, attribute: 'hide-label' })
  hideLabel = false;

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
    const drawer = !this.drawer ? nothing : prefix;
    return html`<div class="indicator">
        <md-focus-ring for=${this.idName} focus-visible></md-focus-ring>
        <md-ripple for=${this.idName} interactive></md-ripple>${indicator}
      </div>
      ${drawer}
      ${this.renderAnchorOrButton(this.renderContent())}${this.drawer ? this.renderBadge(true) : nothing}`;
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
