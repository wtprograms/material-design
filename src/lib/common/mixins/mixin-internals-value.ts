import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from './mixin';
import {
  FormAssociated,
  getFormValue,
  mixinFormAssociated,
} from '../behaviors/form-associated';
import { mixinElementInternals, WithElementInternals } from './mixin-internals';
import { mixinStringValue, ValueElement } from './mixin-value';

export interface InternalValueElement
  extends ValueElement<string>,
    FormAssociated,
    WithElementInternals {}

export function mixinInternalsValue<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, InternalValueElement> {
  const _base = mixinFormAssociated(
    mixinElementInternals(mixinStringValue(base))
  );
  abstract class Mixin extends _base implements InternalValueElement {
    override [getFormValue]() {
      return this.value;
    }

    override formStateRestoreCallback(state: string) {
      this.value = state;
    }

    override formResetCallback(): void {
      this.value = null;
    }
  }

  return Mixin;
}
