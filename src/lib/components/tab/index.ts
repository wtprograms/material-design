import { html, LitElement, nothing, PropertyValues } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { mixinButton, property$ } from '../../common';
import { MdIconElement } from '../icon';
import { MdBadgeElement } from '../badge';
import { mixinSelected } from '../../common/mixins/mixin-selected';
import { mixinBadge } from '../../common/mixins/mixin-badge';

const base = mixinButton(mixinSelected(mixinBadge(LitElement)));

@customElement('md-tab')
export class MdTabElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true, attribute: 'hide-label' })
  hideLabel = false;

  @property({ type: Boolean, reflect: true })
  @property$()
  secondary = false;
  secondary$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true })
  @property$()
  icon = false;
  icon$!: Observable<boolean>;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private _iconElements!: MdIconElement[];

  @query('md-badge')
  private _badgeElement?: MdBadgeElement;

  @query('.label')
  private _labelElement!: HTMLSpanElement;

  readonly contentWidth$ = this.secondary$.pipe(
    map((secondary) => {
      let width = 0;
      if (secondary) {
        width += this._iconElements[0]
          ? this._iconElements[0].offsetWidth + 8
          : 0;
        width += this._labelElement.offsetWidth;
        width += this._badgeElement ? this._badgeElement.offsetWidth + 4 : 0;
      } else {
        const icon = this._iconElements[0]
          ? this._iconElements[0].offsetWidth + 8
          : 0;
        const label = this._labelElement.offsetWidth;
        width = Math.max(icon, label);
      }
      return width;
    })
  );

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    combineLatest({
      dot: this.badgeDot$,
      number: this.badgeNumber$,
      secondary: this.secondary$,
      icon: this.icon$,
    })
      .pipe(
        tap(({ dot, number, secondary }) => {
          if (!secondary) {
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
    return html` <md-focus-ring for="control" focus-visible></md-focus-ring>
      <md-ripple for="control" interactive></md-ripple>
      <div class="icon"><slot name="icon" @slotchange=${() => this.icon = !!this._iconElements.length}></slot></div>
      ${this.renderAnchorOrButton(this.renderContent())}${this.secondary ? this.renderBadge(true) : nothing}`;
  }

  private renderContent() {
    return html`<span class="label"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-tab': MdTabElement;
  }
}
