import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';

export interface Activatable {
  activatable: boolean;
}

export function mixinActivatable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Activatable> {
  abstract class Mixin extends base implements Activatable {
    @property({ type: Boolean, reflect: true })
    activatable = false;
  }

  return Mixin;
}
