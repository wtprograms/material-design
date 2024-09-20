import { html, LitElement, nothing } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinBusyButton } from '../../common/mixins/mixin-busy-button';
import { mixinParentActivation } from '../../common/mixins/mixin-parent-activation';

export type ButtonVariant =
  | 'elevated'
  | 'filled'
  | 'tonal'
  | 'outlined'
  | 'text'
  | 'plain';

const base = mixinBusyButton(mixinParentActivation(LitElement));

@customElement('md-button')
export class MdButtonElement extends base {
  static override styles = [styles];

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
    <slot name="leading" @slotchange=${() => this.leading = !!this._leadingElements.length}></slot>
    ${this.renderAnchorOrButton(this.renderContent())}
    <slot name="trailing" @slotchange=${() => this.trailing = !!this._trailingElements.length}></slot>
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
          for="control"
          interactive
          level=${level}
        ></md-elevation>`
      : nothing;
    return html`${elevation}
      <md-focus-ring for="control" focus-visible></md-focus-ring>
      <md-ripple for="control" interactive></md-ripple>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-button': MdButtonElement;
  }
}
