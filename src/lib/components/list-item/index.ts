import { LitElement, PropertyValues, html, nothing } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import {
  dispatchActivationClick,
  mixinActivatable,
  mixinButton,
  mixinSelectable,
} from '../../common';
import { MdCheckBoxElement } from '../check-box';
import { MdRadioButtonElement } from '../radio-button';
import { MdSwitchElement } from '../switch';

const base = mixinButton(mixinSelectable(LitElement));

@customElement('md-list-item')
export class MdListItemElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  dragged = false;

  @property({ type: Boolean, reflect: true, attribute: 'split-button' })
  splitButton = false;

  @property({ type: Boolean, reflect: true, attribute: 'top-align' })
  topAlign = false;

  @property({ type: Boolean, reflect: true, attribute: 'large-leading' })
  largeLeading = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-leading' })
  hasLeading = false;

  @queryAssignedElements({ slot: 'leading', flatten: true })
  private readonly _leadingSlotElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-trailing' })
  hasTrailing = false;

  @queryAssignedElements({ slot: 'trailing', flatten: true })
  private readonly _trailingSlotElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'non-activatable' })
  nonActivatable = false;

  private get check():
    | MdCheckBoxElement
    | MdRadioButtonElement
    | MdSwitchElement
    | null
    | undefined {
    return this._trailingSlotElements.filter(
      (x) =>
        x instanceof MdCheckBoxElement ||
        x instanceof MdRadioButtonElement ||
        x instanceof MdSwitchElement
    )[0] as
      | MdCheckBoxElement
      | MdRadioButtonElement
      | MdSwitchElement
      | null
      | undefined;
  }

  @property({ type: Boolean, reflect: true, attribute: 'has-supporting-text' })
  hasSupportingText = false;

  @queryAssignedElements({ slot: 'supporting-text', flatten: true })
  private readonly _supportingTextSlotElements!: HTMLElement[];

  protected override render(): unknown {
    const content = !this.nonActivatable ? this.renderAnchorOrButton() : this.renderContent();
    return html`
      ${this.renderElevation()}
      <md-ripple
        for="button"
        ?activatable=${!this.nonActivatable}
        ?disabled=${this.disabled}
      ></md-ripple>
      <md-focus-ring
        for="button"
        focus-visible
        ?disabled=${this.disabled || this.nonActivatable}
      ></md-focus-ring>

      <div class="leading">
        <slot name="leading" @slotchange=${this.onIconSlotChange}></slot>
      </div>
      ${content}
      <div class="trailing">
        <slot name="trailing" @slotchange=${this.onIconSlotChange}></slot>
      </div>`;
  }

  private renderElevation() {
    return this.dragged
      ? html`<md-elevation
          for="button"
          level="4"
          activatable
          ?disabled=${this.disabled}
        ></md-elevation>`
      : nothing;
  }

  override renderContent() {
    return html`
      <span class="headline">
        <slot></slot>
      </span>
      <span class="supporting-text"><slot name="supporting-text"></slot></span>
    `;
  }

  private onIconSlotChange() {
    this.hasLeading = this._leadingSlotElements.length > 0;
    this.hasTrailing = this._trailingSlotElements.length > 0;
    this.hasSupportingText = this._supportingTextSlotElements.length > 0;
  }

  override handleActivationClick(event: MouseEvent) {
    if (!this.splitButton || event.target === this) {
      super.handleActivationClick(event);
    }

    if (!this.splitButton && this.check) {
      dispatchActivationClick(this.check);
    }
    return true;
  }

  protected override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('disabled')) {
      if (this.check) {
        this.check.disabled = this.disabled;
      }
    }
    super.updated(changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-list-item': MdListItemElement;
  }
}
