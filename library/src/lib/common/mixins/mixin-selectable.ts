import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';

export interface Selectable {
  selected: boolean;
}

export function mixinSelectable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Selectable> {
  abstract class Mixin extends base implements Selectable {
    @property({ type: Boolean, reflect: true })
    get selected() {
      return this.hasAttribute('selected');
    }
    set selected(value: boolean) {
      if (value) {
        this.setAttribute('selected', '');
      } else {
        this.removeAttribute('selected');
      }
      this.dispatchEvent(new Event('selected-change', {bubbles: true}));
    }
  }

  return Mixin;
}
