import { LitElement } from 'lit';
import { query } from 'lit/decorators.js';
import { dispatchActivationClick } from '../events/dispatch-activation-click';
import { isActivationClick } from '../events/is-activation-click';
import { MixinBase, MixinReturn } from './mixin';

export interface ParentActivationElement {
  handleActivationClick(event: MouseEvent): void;
}

export function mixinParentActivation<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, ParentActivationElement> {
  abstract class Mixin extends base implements ParentActivationElement {
    @query('#control')
    readonly controlElement!: HTMLElement;

    override connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener('click', this.handleActivationClick.bind(this));
    }

    override focus() {
      this.controlElement?.focus();
    }

    override blur() {
      this.controlElement?.blur();
    }

    handleActivationClick(event: MouseEvent) {
      if (!isActivationClick(event) || !this.controlElement) {
        return;
      }
      this.focus();
      dispatchActivationClick(this.controlElement);
    }
  }

  return Mixin;
}
