import { LitElement, html, nothing } from 'lit';
import { property, query, queryAssignedElements } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { Control, mixinControl } from './mixin-control';
import { isActivationClick } from '../events/is-activation-click';
import { dispatchActivationClick } from '../events/dispatch-activation-click';

export type CheckType = 'checkbox' | 'radio';

export interface CheckControl extends Control {
  checked: boolean;
  inputElement: HTMLInputElement;
  hasLabel: boolean;
  hasError: boolean;
  indeterminate: boolean;
  labelSlots: HTMLElement[];
  noFocusRing: boolean;
  noRipple: boolean;
  required: boolean;
  renderInput(checkType: CheckType): unknown;
  renderLabel(): unknown;
  renderRipple(): unknown;
  renderFocusRing(): unknown;
  handleInputChange(event: Event): void;
  onSlotsChange(): void;
}

export function mixinCheck<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, CheckControl> {
  const _base = mixinControl(base);
  abstract class Mixin extends _base implements CheckControl {
    @property({ type: Boolean, reflect: true, attribute: 'has-label' })
    hasLabel = false;

    @property({ type: Boolean, reflect: true, attribute: 'has-error' })
    hasError = false;

    @property({ type: Boolean, reflect: true })
    indeterminate = false;

    @property({ type: Boolean, reflect: true, attribute: 'no-ripple' })
    noRipple = false;

    @property({ type: Boolean, reflect: true, attribute: 'no-focus-ring' })
    noFocusRing = false;

    @property({ type: Boolean })
    required = false;

    @property({ type: Boolean, noAccessor: true })
    get checked() {
      return this.hasAttribute('checked');
    }
    set checked(value: boolean) {
      if (value) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }
      this.dispatchEvent(new Event('checked-change'));
      this.value = value.toString();
    }

    @query('#input')
    inputElement!: HTMLInputElement;

    @queryAssignedElements({ slot: 'label', flatten: true })
    labelSlots!: HTMLElement[];

    override connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener('click', this.handleActivationClick.bind(this));
    }

    renderInput(checkType: CheckType) {
      return html`<input
        id="input"
        type=${checkType}
        ?checked=${this.checked}
        ?indeterminate=${this.indeterminate}
        ?disabled=${this.disabled}
        @change=${this.handleInputChange}
      />`;
    }

    renderLabel(): unknown {
      return html` <div class="label">
        <slot name="label" @slotchange=${this.onSlotsChange}></slot>
      </div>`;
    }

    renderRipple(): unknown {
      return this.noRipple
        ? nothing
        : html`<md-ripple
            for="input"
            hoverable
            activatable
            ?disabled=${this.disabled}
          ></md-ripple>`;
    }

    renderFocusRing(): unknown {
      return this.noFocusRing
        ? nothing
        : html` <md-focus-ring
            for="input"
            focus-visible
            ?disabled=${this.disabled}
          ></md-focus-ring>`;
    }

    handleInputChange(): void {
      if (this.inputElement.checked === this.checked) {
        return;
      }
      this.checked = this.inputElement.checked;
    }

    onSlotsChange(): void {
      this.hasLabel = this.labelSlots.length > 0;
    }

    private handleActivationClick(event: MouseEvent) {
      if (!isActivationClick(event) || !this.inputElement) {
        return;
      }
      this.focus();
      dispatchActivationClick(this.inputElement);
    }
  }

  return Mixin;
}
