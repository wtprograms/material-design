import { LitElement, html } from 'lit';
import {
  customElement,
} from 'lit/decorators.js';
import style from './index.scss';
import { mixinButton } from '../../common';

const base = mixinButton(LitElement);

@customElement('md-menu-item')
export class MdMenuItemElement extends base {
  static override styles = [style];

  override render() {
    return html`<md-ripple for="button" hoverable activatable></md-ripple>
      <slot name="icon"></slot> ${this.renderAnchorOrButton()}
      <slot name="trailing"></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-menu-item': MdMenuItemElement;
  }
}
