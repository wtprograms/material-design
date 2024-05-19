import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { property } from 'lit/decorators.js';
import { Openable } from './openable';

export function mixinOpenable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Openable> {
  abstract class OpenableMixin extends base implements Openable {
    @property({ type: Boolean, noAccessor: true })
    get open() {
      return !!this.hasAttribute('open');
    }
    set open(value: boolean) {
      if (value) {
        this.setAttribute('open', '');
        this.show();
      } else {
        this.removeAttribute('open');
        this.close();
      }
    }
  
    @property({ type: Boolean, reflect: true })
    opening = false;
  
    @property({ type: Boolean, reflect: true })
    closing = false;

    async show(): Promise<void> {}

    async close(): Promise<void> {}
  }

  return OpenableMixin;
}
