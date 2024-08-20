import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from './mixin';
import { property } from 'lit/decorators.js';

export interface Disabled {
  disabled: boolean;
}

export function mixinDisabled<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Disabled> {
  abstract class Mixin extends base implements Disabled {
    @property({ type: Boolean, reflect: true, noAccessor: true })
    get disabled() {
      return this.hasAttribute('disabled');
    }
    set disabled(value: boolean) {
      if (value === this.disabled) {
        return;
      }
      if (value) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
      this.dispatchEvent(new Event('disabled-change'));
    }
  }

  return Mixin;
}
