import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { Disabled, mixinDisabled } from './mixin-disabled';
import { mixinElementInternals, WithElementInternals } from './mixin-internals';

export interface Control extends Disabled, WithElementInternals {
  name: string;
  value: string | null;
  coerceValue(value: string | null): string | null;
}

export function mixinControl<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Control> {
  const _base = mixinDisabled(mixinElementInternals(base));
  abstract class Mixin extends _base implements Control {
    @property({ noAccessor: true })
    get name() {
      return this.getAttribute('name') ?? '';
    }
    set name(name: string) {
      if (name) {
        this.setAttribute('name', name);
      } else {
        this.removeAttribute('name');
      }
    }

    @property({ type: String })
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
      this.dispatchEvent(new Event('value-change'));
    }

    coerceValue(value: string | null): string | null {
      return value;
    }
  }
  return Mixin;
}
