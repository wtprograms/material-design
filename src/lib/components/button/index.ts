import { html, LitElement, nothing } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinBusyButton } from '../../common/mixins/mixin-busy-button';
import { mixinParentActivation } from '../../common/mixins/mixin-parent-activation';
import { FormSubmitter, mixinElementInternals, setupFormSubmitter } from '../../common';

export type ButtonVariant =
  | 'elevated'
  | 'filled'
  | 'tonal'
  | 'outlined'
  | 'text'
  | 'plain';

const base = mixinElementInternals(mixinBusyButton(mixinParentActivation(LitElement)));

@customElement('md-button')
export class MdButtonElement extends base implements FormSubmitter {
  static override styles = [styles];

  static {
    setupFormSubmitter(MdButtonElement);
  }

  static readonly formAssociated = true;

  @property({ type: String, reflect: true })
  variant: ButtonVariant = 'filled';

  @property({ type: Boolean, reflect: true })
  leading = false;

  @property({ type: Boolean, reflect: true })
  trailing = false;

  @queryAssignedElements({ slot: 'leading', flatten: true })
  private _leadingElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'trailing', flatten: true })
  private _trailingElements!: HTMLElement[]

  protected override render(): unknown {
    return html`${this.renderAttachables()}
    <span class="leading"><slot name="leading" @slotchange=${() => this.leading = !!this._leadingElements.length}></slot></span>
    ${this.renderAnchorOrButton(this.renderContent())}
    <span class="trailing"><slot name="trailing" @slotchange=${() => this.trailing = !!this._trailingElements.length}></slot></span>
    ${this.renderProgressIndicator()}`;
  }

  private renderContent() {
    return html`<slot></slot>`;
  }

  private renderAttachables() {
    const elevatedVariants: ButtonVariant[] = ['elevated', 'filled', 'tonal'];
    const level = this.variant === 'elevated' ? 1 : 0;
    const elevation = elevatedVariants.includes(this.variant)
      ? html`<md-elevation
          for=${this.idName}
          interactive
          level=${level}
        ></md-elevation>`
      : nothing;
    return html`${elevation}
      <md-focus-ring for=${this.idName} focus-visible></md-focus-ring>
      <md-ripple for=${this.idName} interactive></md-ripple>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-button': MdButtonElement;
  }
}
