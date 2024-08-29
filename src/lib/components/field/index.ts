import { html, LitElement, nothing, PropertyValues } from 'lit';
import {
  customElement,
  query,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinField } from '../../common';

const base = mixinField(LitElement);

@customElement('md-field')
export class MdFieldElement extends base {
  static override styles = [styles];

  @query('.leading')
  private _leading!: HTMLElement;

  @query('.label')
  private _label?: HTMLElement;

  @query('.small-label')
  private _smallLabel?: HTMLElement;

  @query('.border-after')
  private _borderAfter!: HTMLElement;

  override render() {
    return html`${this.renderBody()} ${this.renderFooter()}`;
  }

  renderBody(): unknown {
    const leading = this.hasLeading
      ? html`<div class="leading">
          <slot name="leading"></slot>
        </div>`
      : nothing;
    const trailing = this.hasTrailing
      ? html`<div class="trailing">
          <slot name="trailing"></slot>
        </div>`
      : nothing;
    const ripple =
      this.variant === 'filled'
        ? html`<md-ripple for="body" hoverable></md-ripple>`
        : nothing;
    return html` <span class="label">${this.label}</span>
      <span class="small-label">${this.label}</span>
      <div id="body" class="body">
        ${ripple}
        <div class="container"></div>
        <div class="container-top border-before"></div>
        <div class="container-top border-after"></div>
        ${leading} ${this.renderControl()} ${trailing}
      </div>`;
  }

  renderFooter(): unknown {
    const supportingText = this.supportingText
      ? html`<span class="supporting-text">${this.supportingText}</span>`
      : nothing;
    const errorText = this.errorText
      ? html`<span class="error">${this.errorText}</span>`
      : nothing;
    const counter = this.counterText
      ? html`<span class="counter">${this.counterText}</span>`
      : nothing;
    if (
      supportingText === nothing &&
      errorText === nothing &&
      counter === nothing
    ) {
      return nothing;
    }
    return html`<div class="footer">
      <div class="supporting-text-div">${supportingText} ${errorText}</div>
      ${counter}
    </div>`;
  }

  renderControl(): unknown {
    return html`<div class="control" @click=${this.onControlClick}>
      ${this.prefixText}
      <slot></slot>
      ${this.suffixText}
      <slot name="suffix"></slot>
    </div>`;
  }

  onControlClick(): void {
    this.dispatchEvent(new CustomEvent('control-click', { bubbles: true }));
  }

  protected override updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);
    this.updateLabelLeft();
    if (_changedProperties.has('populated')) {
      this.updateContainerTop();
    }
  }

  private updateLabelLeft(): void {
    if (!this._label) {
      return;
    }
    let left = 16;
    if (this.hasLeading) {
      left -= 2;
      left += this._leading.offsetWidth + 16;
    }
    this._label.style.left = `${left}px`;
  }

  private updateContainerTop(): void {
    if (!this._smallLabel && !this.label) {
      return;
    }

    if (!this.populated) {
      this._borderAfter.style.marginLeft = '';
      return;
    }
    this._borderAfter.style.marginLeft =
      12 + 8 + this._smallLabel!.offsetWidth + 'px';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-field': MdFieldElement;
  }
}
