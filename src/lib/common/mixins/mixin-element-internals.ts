import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from './mixin';
import { ObservableElement } from '../lit/observable-element';

export const internals = Symbol('internals');

export interface WithElementInternals {
  [internals]: ElementInternals;
}

const privateInternals = Symbol('privateInternals');

export function mixinElementInternals<T extends MixinBase<ObservableElement>>(
  base: T
): MixinReturn<T, WithElementInternals> {
  abstract class Mixin extends base implements WithElementInternals {
    get [internals]() {
      if (!this[privateInternals]) {
        this[privateInternals] = (this as HTMLElement).attachInternals();
      }

      return this[privateInternals];
    }

    [privateInternals]?: ElementInternals;
  }
  return Mixin;
}
