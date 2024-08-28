import { LitElement, html, nothing } from 'lit';
import {
  customElement,
  property,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinActivatable, mixinButton } from '../../common';

export type AvatarPalette =
  | 'surface'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'plain';

const base = mixinButton(mixinActivatable(LitElement));

@customElement('md-avatar')
export class MdAvatarElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  palette: AvatarPalette = 'primary';

  @property({ type: String })
  src: string | null = null;

  @property({ type: String, attribute: 'full-name' })
  fullName: string | null = null;

  @property({ type: Number, reflect: true })
  get size(): number | null {
    return this._size;
  }
  set size(value: number | null) {
    this._size = value;
    this.updateIconSize();
  }
  private _size: number | null = null;

  get initial() {
    if (!this.fullName) {
      return '';
    }
    return this.fullName
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('')[0];
  }

  override connectedCallback() {
    super.connectedCallback();
    this.updateIconSize();
  }

  protected override render(): unknown {
    return this.activatable ? html`
      <md-ripple
        for=${this.targetId}
        activatable
        ?disabled=${this.disabled}
      ></md-ripple>
      <md-focus-ring
        for=${this.targetId}
        focus-visible
        ?disabled=${this.disabled}
      ></md-focus-ring>
      ${this.renderAnchorOrButton()}` : html`${this.renderContent()}`;
  }

  override renderContent() {
    const content = this.src ? html`<img src=${this.src} alt=${this.fullName ?? nothing} />` : this.initial;
    return html`${content}`;
  }

  private updateIconSize() {
    if (this._size !== null) {
      this.style.setProperty('--md-comp-avatar-size', `${this._size}px`);
    } else {
      this.style.removeProperty('--md-comp-avatar-size');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-avatar': MdAvatarElement;
  }
}
