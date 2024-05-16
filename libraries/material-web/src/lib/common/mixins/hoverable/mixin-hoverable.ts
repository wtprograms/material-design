import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { property } from 'lit/decorators.js';
import { Hoverable } from './hoverable';

export function mixinHoverable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Hoverable> {
  abstract class HoverableMixin extends base implements Hoverable {
    @property({ type: Boolean })
    hoverable = false;
  }
  return HoverableMixin;
}
