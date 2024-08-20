import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';

export interface Hoverable {
  hoverable: boolean;
}

export function mixinHoverable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Hoverable> {
  abstract class Mixin extends base implements Hoverable {
    @property({ type: Boolean })
    hoverable = false;
  }
  return Mixin;
}
