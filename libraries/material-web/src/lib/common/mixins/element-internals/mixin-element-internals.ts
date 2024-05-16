import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { WithElementInternals } from './with-element-internals';
import { internals } from './internals';

const privateInternals = Symbol('privateInternals');

export function mixinElementInternals<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, WithElementInternals> {
  abstract class WithElementInternalsMixin
    extends base
    implements WithElementInternals
  {
    get [internals]() {
      if (!this[privateInternals]) {
        this[privateInternals] = (this as HTMLElement).attachInternals();
      }

      return this[privateInternals];
    }

    [privateInternals]?: ElementInternals;
  }
  return WithElementInternalsMixin;
}
