import { LitElement, html, nothing } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import {
  internals,
  mixinButton,
  mixinElementInternals,
  setupFormSubmitter,
} from '../../common';
import { ButtonVariant } from './button-variant';
import style from './index.scss';

const base = mixinButton(mixinElementInternals(LitElement));

@customElement('md-button')
export class MdButtonElement extends base {
  static override styles = [style];

  static {
    setupFormSubmitter(MdButtonElement);
  }

  static readonly formAssociated = true;

  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  @property({ type: Boolean, attribute: 'trailing-icon', reflect: true })
  trailingIcon = false;

  @property({ type: String, reflect: true })
  variant: ButtonVariant = 'filled';

  get form() {
    return this[internals].form;
  }

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly _iconSlots!: HTMLElement[];

  @property({ type: Boolean, attribute: 'has-icon', reflect: true })
  hasIcon = false;

  override render() {
    const icon = html`<slot
      name="icon"
      @slotchange=${this.onSlotChange}
    ></slot>`;
    const elevation =
      this.variant === 'outlined' || this.variant === 'text'
        ? nothing
        : html`<md-elevation
            for="button"
            hoverable
            activatable
            ?disabled=${this.disabled}
          ></md-elevation>`;
    return html` <div class="container"></div>
      ${elevation}
      <md-focus-ring
        for="button"
        focus-visible
        ?disabled=${this.disabled}
      ></md-focus-ring>
      <md-ripple for="button" hoverable activatable ?disabled=${this.disabled}>
      </md-ripple>
      ${this.trailingIcon ? nothing : icon}
      ${this.renderAnchorOrButton()}
      ${this.trailingIcon ? icon : nothing}`;
  }

  private onSlotChange() {
    this.hasIcon = this._iconSlots.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-button': MdButtonElement;
  }
}
