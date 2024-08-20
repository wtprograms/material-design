import { html, LitElement, nothing, PropertyValues } from 'lit';
import { property, query, queryAssignedElements } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { Control, mixinControl } from './mixin-control';

export type FieldVariant = 'filled' | 'outlined';

export interface Field extends Control {
  variant: FieldVariant;
  populated: boolean;
  label: string | null;
  hasSupportingText: boolean;
  supportingTextSlots: HTMLElement[];
  hasError: boolean;
  errorSlots: HTMLElement[];
  hasCounter: boolean;
  counterSlots: HTMLElement[];
  hasLeading: boolean;
  leadingSlots: HTMLElement[];
  hasTrailing: boolean;
  trailingSlots: HTMLElement[];
  renderInput(): unknown;
  renderLeading(): unknown;
  renderTrailing(): unknown;
  renderFooter(): unknown;
  renderBody(): unknown;
  onSupportingTextSlotChange(): void;
  onErrorSlotChange(): void;
  onCounterSlotChange(): void;
  onLeadingSlotChange(): void;
  onTrailingSlotChange(): void;
  onControlClick(event: Event): void;
  renderControl(): unknown;
}

export function mixinField<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Field> {
  const _base = mixinControl(base);
  abstract class Mixin extends _base implements Field {
    @property({ type: Boolean, reflect: true })
    populated = false;

    @property({ type: String, reflect: true })
    label: string | null = null;

    @property({ type: String, reflect: true })
    variant: FieldVariant = 'filled';

    @property({
      type: Boolean,
      reflect: true,
      attribute: 'has-supporting-text',
    })
    hasSupportingText = false;

    @queryAssignedElements({ slot: 'supporting-text', flatten: true })
    supportingTextSlots!: HTMLElement[];

    @property({ type: Boolean, reflect: true, attribute: 'has-counter' })
    hasCounter = false;

    @queryAssignedElements({ slot: 'counter', flatten: true })
    counterSlots!: HTMLElement[];

    @property({ type: Boolean, reflect: true, attribute: 'has-leading' })
    hasLeading = false;

    @queryAssignedElements({ slot: 'leading', flatten: true })
    leadingSlots!: HTMLElement[];

    @property({ type: Boolean, reflect: true, attribute: 'has-trailing' })
    hasTrailing = false;

    @queryAssignedElements({ slot: 'trailing', flatten: true })
    trailingSlots!: HTMLElement[];

    @property({ type: Boolean, reflect: true, attribute: 'has-error' })
    hasError = false;

    @queryAssignedElements({ slot: 'trailing', flatten: true })
    errorSlots!: HTMLElement[];

    @query('.leading')
    private _leading!: HTMLElement;

    @query('.label')
    private _label?: HTMLElement;

    @query('.small-label')
    private _smallLabel?: HTMLElement;

    @query('.border-after')
    private _borderAfter!: HTMLElement;

    renderFooter(): unknown {
      return html`<div class="footer">
        <div class="supporting-text-div">
          <div class="supporting-text">
            <slot
              name="supporting-text"
              @slotchange=${this.onSupportingTextSlotChange}
            ></slot>
          </div>
          <div class="error">
            <slot name="error" @slotchange=${this.onErrorSlotChange}></slot>
          </div>
        </div>
        <div class="counter">
          <slot name="counter" @slotchange=${this.onCounterSlotChange}></slot>
        </div>
      </div>`;
    }

    renderBody(): unknown {
      const ripple = this.variant === 'filled' ? html`<md-ripple for="body" hoverable></md-ripple>` : nothing;
      return html` <span class="label">${this.label}</span>
        <span class="small-label">${this.label}</span>
        <div id="body" class="body">
          ${ripple}
          <div class="container"></div>
          <div class="container-top border-before"></div>
          <div class="container-top border-after"></div>
          ${this.renderLeading()} ${this.renderControl()}
          ${this.renderTrailing()}
        </div>`;
    }

    renderControl(): unknown {
      return html`<div class="control" @click=${this.onControlClick}>
        <slot name="prefix"></slot>
        ${this.renderInput()}
        <slot name="suffix"></slot>
      </div>`;
    }

    renderLeading(): unknown {
      return html`<div class="leading">
        <slot name="leading" @slotchange=${this.onLeadingSlotChange}></slot>
      </div>`;
    }

    renderTrailing(): unknown {
      return html`<div class="trailing">
        <slot name="trailing" @slotchange=${this.onTrailingSlotChange}></slot>
      </div>`;
    }

    abstract renderInput(): unknown;

    onSupportingTextSlotChange(): void {
      this.hasSupportingText = this.supportingTextSlots.length > 0;
    }

    onErrorSlotChange(): void {
      this.hasError = this.errorSlots.length > 0;
    }

    onCounterSlotChange(): void {
      this.hasCounter = this.counterSlots.length > 0;
    }

    onLeadingSlotChange(): void {
      this.hasLeading = this.leadingSlots.length > 0;
      this.updateLabelLeft();
    }

    onTrailingSlotChange(): void {
      this.hasTrailing = this.trailingSlots.length > 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onControlClick(event: Event): void {}

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
      this._borderAfter.style.marginLeft = 12 + 8 + this._smallLabel!.offsetWidth + 'px';
    }
  }
  return Mixin;
}
