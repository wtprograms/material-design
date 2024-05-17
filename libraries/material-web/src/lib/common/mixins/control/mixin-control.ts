import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { property } from 'lit/decorators.js';
import { Control } from './control';
import { mixinDisable } from '../disable/mixin-disable';

export function mixinControl<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Control> {
  const disableBase = mixinDisable(base);
  abstract class ControlMixin extends disableBase implements Control {
    @property({ noAccessor: true })
    get name() {
      return this.getAttribute('name') ?? '';
    }
    set name(name: string) {
      this.setAttribute('name', name);
    }

    @property({ noAccessor: true })
    get value() {
      return this.getAttribute('value') ?? '';
    }
    set value(value: string | null) {
      value = this.coerceValue(value);
      if (value) {
        this.setAttribute('value', value);
      } else {
        this.removeAttribute('value');
      }
      this.requestUpdate('value');
    }

    coerceValue(value: string | null): string | null {
      return value;
    }
  }
  return ControlMixin;
}
