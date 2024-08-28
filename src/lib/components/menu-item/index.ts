import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinButton, mixinSelectable } from '../../common';
import { MdMenuElement } from '../menu';

const base = mixinButton(mixinSelectable(LitElement));

@customElement('md-menu-item')
export class MdMenuItemElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true, attribute: 'has-leading' })
  hasLeading = false;

  @queryAssignedElements({ slot: 'leading', flatten: true })
  private readonly _leadingSlotElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-trailing' })
  hasTrailing = false;

  @property({ type: Boolean, reflect: true })
  open = false;

  @queryAssignedElements({ slot: 'trailing', flatten: true })
  private readonly _trailingSlotElements!: HTMLElement[];

  get parentMenu(): MdMenuElement | undefined {
    return this.parentElement instanceof MdMenuElement
      ? this.parentElement
      : undefined;
  }

  subMenu?: MdMenuElement;

  protected override render(): unknown {
    return html`
      <md-ripple
        for="button"
        activatable
        ?disabled=${this.disabled}
        ?external-activated=${this.open}
      ></md-ripple>
      <md-focus-ring
        for="button"
        focus-visible
        ?disabled=${this.disabled}
      ></md-focus-ring>

      <div class="leading">
        <slot
          name="leading"
          @slotchange=${this.onLeadingTrailingSlotChange}
        ></slot>
      </div>
      ${this.renderAnchorOrButton()}
      <div class="trailing">
        <slot
          name="trailing"
          @slotchange=${this.onLeadingTrailingSlotChange}
        ></slot>
      </div>`;
  }

  private onLeadingTrailingSlotChange() {
    this.hasLeading = this._leadingSlotElements.length > 0;
    this.hasTrailing = this._trailingSlotElements.length > 0;
  }

  override handleActivationClick(event: MouseEvent): boolean {
    const result = super.handleActivationClick(event);
    if (!this.subMenu) {
      this.dispatchEvent(new Event('close-popover', { bubbles: true }));
    }
    return result;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-menu-item': MdMenuItemElement;
  }
}
