import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { property } from 'lit/decorators.js';
import { Activatable } from './activatable';

export function mixinActivatable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Activatable> {
  abstract class ActivatableMixin extends base implements Activatable {
    @property({ type: Boolean, reflect: true })
    activatable = false;
  }

  return ActivatableMixin;
}
