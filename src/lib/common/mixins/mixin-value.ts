import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { property$ } from '../lit/property$.decorator';

export interface ValueElement<TValue> {
  value: TValue;
  value$: Observable<TValue>;
}

export function mixinValue<TValue, T extends MixinBase<LitElement>>(
  initialValue: TValue,
  type: typeof String | typeof Number | typeof Boolean,
  base: T
): MixinReturn<T, ValueElement<TValue>> {
  abstract class Mixin extends base implements ValueElement<TValue> {
    @property({ type, reflect: true })
    @property$()
    value: TValue = initialValue;
    value$!: Observable<TValue>;

    override connectedCallback(): void {
      super.connectedCallback();
      this.value$
        .pipe(
          distinctUntilChanged(),
          tap(() => this.dispatchEvent(new Event('change')))
        )
        .subscribe();
    }
  }

  return Mixin;
}

export const mixinStringValue = <T extends MixinBase<LitElement>>(base: T, initialValue = '') => mixinValue(initialValue, String, base);

export const mixinNumberValue = <T extends MixinBase<LitElement>>(base: T, initialValue = 0) => mixinValue(initialValue, Number, base);

export const mixinBooleanValue = <T extends MixinBase<LitElement>>(base: T, initialValue = false) => mixinValue(initialValue, Boolean, base);

