import { LitElement, html, nothing } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinButton } from '../../common';

export type ButtonVariant =
  | 'elevated'
  | 'filled'
  | 'tonal'
  | 'outlined'
  | 'text';

const base = mixinButton(LitElement);

@customElement('md-button')
export class MdButtonElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  variant: ButtonVariant = 'filled';

  @property({ type: Boolean, reflect: true, attribute: 'has-icon' })
  hasIcon = false;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly iconSlotElements!: HTMLElement[];

  protected override render(): unknown {
    return html`<div class="container"></div> ${this.renderElevation()}
      <md-ripple
        for="button"
        activatable
        ?disabled=${this.disabled}
      ></md-ripple>
      <md-focus-ring
        for="button"
        focus-visible
        ?disabled=${this.disabled}
      ></md-focus-ring>
      ${this.renderAnchorOrButton()}`;
  }

  private renderElevation() {
    if (this.variant === 'outlined' || this.variant === 'text') {
      return nothing;
    }
    const level = this.variant === 'elevated' && !this.disabled ? 1 : 0;
    return html`<md-elevation
      for="button"
      level=${level}
      activatable
      ?disabled=${this.disabled}
    ></md-elevation>`;
  }

  override renderContent() {
    return html` <slot name="icon" @slotchange=${this.onIconSlotChange}></slot>
      <slot></slot>`;
  }

  private onIconSlotChange() {
    this.hasIcon = this.iconSlotElements.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-button': MdButtonElement;
  }
}
