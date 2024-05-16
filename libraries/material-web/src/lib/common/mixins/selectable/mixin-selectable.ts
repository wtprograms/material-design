import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { property } from 'lit/decorators.js';
import { Selectable } from './selectable';

export function mixinSelectable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Selectable> {
  abstract class SelectableMixin extends base implements Selectable {
    @property({ type: Boolean })
    get selected() {
      return this._selected;
    }
    set selected(value: boolean) {
      this._selected = value;
      this.dispatchEvent(new Event('selectedchange'));
    }
    private _selected = false;
  }

  return SelectableMixin;
}
