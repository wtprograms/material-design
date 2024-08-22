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
    @property({ type: Boolean, reflect: true })
    disabled = false;
  }

  return Mixin;
}
