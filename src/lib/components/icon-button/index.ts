import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinButton, mixinSelectable } from '../../common';

export type IconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard';

const base = mixinButton(mixinSelectable(LitElement));

@customElement('md-icon-button')
export class MdIconButtonElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  variant: IconButtonVariant = 'standard';

  @property({ type: Boolean, reflect: true, attribute: 'has-icon' })
  hasIcon = false;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly iconSlotElements!: HTMLElement[];

  protected override render(): unknown {
    return html`
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
      ${this.renderAnchorOrButton()}`;
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
    'md-icon-button': MdIconButtonElement;
  }
}
