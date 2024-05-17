import { LitElement, TemplateResult, html, isServer } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import {
  property,
  query,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { Check } from './check';
import { mixinControl } from '../control/mixin-control';
import { isActivationClick } from '../../events/is-activation-click';
import { dispatchActivationClick } from '../../events/dispatch-activation-click';

export function mixinCheck<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Check> {
  const _base = mixinControl(base);
  abstract class CheckMixin extends _base implements Check {
    @queryAssignedElements({ slot: 'label', flatten: true })
    private readonly _labelElements!: HTMLElement[];

    @state()
    hasLabel = false;

    @property({ type: Boolean, reflect: true })
    checked = false;

    @query('input')
    inputElement!: HTMLInputElement;

    @property({ type: Boolean, reflect: true })
    error = false;

    abstract get icon(): string;

    constructor() {
      super();
      if (!isServer) {
        this.addEventListener('click', this.handleActivationClick.bind(this));
      }
    }

    override focus() {
      this.inputElement?.focus();
    }

    override blur() {
      this.inputElement?.blur();
    }

    toggle() {
      this.checked = !this.checked;
    }

    onSlotChange() {
      this.hasLabel = this._labelElements.length > 0;
    }

    handleActivationClick(event: MouseEvent) {
      if (!isActivationClick(event) || !this.inputElement) {
        return;
      }
      this.focus();
      dispatchActivationClick(this.inputElement);
    }

    renderLabel(): TemplateResult {
      return html`<label for="input" ?hidden=${!this.hasLabel}
        ><slot name="label" @slotchange=${this.onSlotChange}></slot
      ></label>`;
    }

    renderAttachables(): TemplateResult {
      return html`<md-focus-ring for="input" focus-visible></md-focus-ring>
        <md-ripple for="input" hoverable activatable></md-ripple>`;
    }

    renderIcon(size: number): TemplateResult {
      return html`<md-icon size=${size}>${this.icon}</md-icon>`;
    }
  }
  return CheckMixin;
}
