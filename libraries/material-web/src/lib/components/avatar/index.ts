import { LitElement, html } from 'lit';
import {
  customElement,
  property,
} from 'lit/decorators.js';
import {
  mixinActivatable,
  mixinButton,
} from '../../common';
import style from './index.scss';
import { AvatarPalette } from './avatar-palette';

const base = mixinActivatable(mixinButton(LitElement));

@customElement('md-avatar')
export class MdAvatarElement extends base {
  static override styles = [style];

  @property({ type: String, reflect: true })
  variant: AvatarPalette = 'surface';

  @property({ type: String })
  src: string | null = null;

  @property({ type: String })
  alt = '';

  @property({ type: String, attribute: 'avatar-name'})
  avatarName = '';

  @property({ type: Number, reflect: true })
  size: number | null = null;

  get initial(): string {
    return this.avatarName.length === 0 ? '' : this.avatarName[0].toUpperCase();
  }

  override render() {
    if (!this.activatable) {
      return html`<div class="container"></div>${this.renderContent()}`;
    }

    return html`<div class="container"></div>
      <md-focus-ring
        for="button"
        focus-visible
        ?disabled=${this.disabled}
      ></md-focus-ring>
      ${this.renderAnchorOrButton()}
      <md-ripple for="button" hoverable activatable ?disabled=${this.disabled}>
      </md-ripple>
`;
  }

  override renderContent() {
    if (this.src) {
      return html`<img src=${this.src} alt=${this.alt} />`;
    }
    return html`${this.initial}`;
  }

  protected override update(changedProperties: Map<PropertyKey, unknown>) {
    super.update(changedProperties);
    if (changedProperties.has('size')) {
      if (this.size) {
        this.style.setProperty('--_size', this.size + 'px');
      } else {
        this.style.setProperty('--_size', '');
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-avatar': MdAvatarElement;
  }
}
