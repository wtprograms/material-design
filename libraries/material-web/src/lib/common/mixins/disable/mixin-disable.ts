import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { property } from 'lit/decorators.js';
import { Disable } from './disable';

export function mixinDisable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Disable> {
  abstract class DisableMixin extends base implements Disable {
    @property({ type: Boolean, noAccessor: true })
    get disabled() {
      return this.hasAttribute('disabled');
    }
    set disabled(disabled: boolean) {
      this.toggleAttribute('disabled', disabled);
    }
  }

  return DisableMixin;
}
