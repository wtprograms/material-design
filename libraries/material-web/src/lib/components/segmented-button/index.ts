import { LitElement, html, nothing } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import style from './index.scss';
import { mixinButton, mixinSelectable } from '../../common';

const base = mixinSelectable(mixinButton(LitElement));

@customElement('md-segmented-button')
export class MdSegementedButtonElement extends base {
  static override styles = [style];

  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly _iconSlots!: HTMLElement[];

  @property({ type: Boolean, attribute: 'has-icon', reflect: true })
  hasIcon = false;

  override render() {
    const checkedIcon = this.selected ? html`<md-icon filled>check</md-icon>` : nothing;
    return html` <div class="container"></div>
      <md-focus-ring
        for="button"
        focus-visible
        ?disabled=${this.disabled}
      ></md-focus-ring>
      <md-ripple for="button" hoverable activatable ?disabled=${this.disabled}>
      </md-ripple>
      <slot name="icon" @slotchange=${this.onSlotChange} ?hidden=${this.selected}></slot>
      ${checkedIcon}
      ${this.renderAnchorOrButton()}
      <slot name="badge"></slot>`;
  }

  private onSlotChange() {
    this.hasIcon = this._iconSlots.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-segmented-button': MdSegementedButtonElement;
  }
}
