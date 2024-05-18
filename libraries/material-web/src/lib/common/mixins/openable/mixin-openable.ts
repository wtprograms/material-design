import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { property } from 'lit/decorators.js';
import { Openable } from './openable';

export function mixinOpenable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Openable> {
  abstract class OpenableMixin extends base implements Openable {
    @property({ type: Boolean, reflect: true, noAccessor: true })
    get open() {
      return this.getAttribute('open') !== null;
    }
    set open(value: boolean) {
      if (value) {
        this.show();
        this.setAttribute('open', '');
      } else {
        this.hide();
        this.removeAttribute('open');
      }
      this.requestUpdate('open');
    }

    async hide(): Promise<void> {}

    async show(): Promise<void> {}
  }

  return OpenableMixin;
}
