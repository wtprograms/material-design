import { LitElement, html, nothing } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinButton, setupFormSubmitter } from '../../common';

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

  static {
    setupFormSubmitter(MdButtonElement);
  }

  static readonly formAssociated = true;

  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  @property({ type: String, reflect: true })
  variant: ButtonVariant = 'filled';

  @property({ type: Boolean, reflect: true, attribute: 'has-icon' })
  hasIcon = false;

  @property({ type: Boolean, reflect: true })
  busy = false;

  @property({ type: Number, attribute: 'progress-value' })
  progressValue = 0;

  @property({ type: Number, attribute: 'progress-max' })
  progressMax = 1;

  @property({ type: Boolean, attribute: 'progress-indeterminate' })
  progressIndeterminate = false;

  @property({ type: Number, attribute: 'progress-buffer' })
  progressBuffer = 0;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly iconSlotElements!: HTMLElement[];

  protected override render(): unknown {
    const progress = this.busy
      ? html`<div class="progress">
          <md-progress-indicator
            ?indeterminate=${this.progressIndeterminate}
            buffer=${this.progressBuffer}
            value=${this.progressValue}
            max=${this.progressMax}
          ></md-progress-indicator>
        </div>`
      : nothing;
    return html`
      ${this.renderElevation()}
      <md-ripple
        for="button"
        activatable
        ?disabled=${this.disabled || this.busy}
      ></md-ripple>
      <md-focus-ring
        for="button"
        focus-visible
        ?disabled=${this.disabled || this.busy}
      ></md-focus-ring>
      ${this.renderAnchorOrButton()} ${progress}`;
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
