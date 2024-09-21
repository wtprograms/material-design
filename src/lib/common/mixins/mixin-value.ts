import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { property$ } from '../lit/property$.decorator';

export interface ValueElement<TValue> {
  value: TValue | null;
  value$: Observable<TValue | null>;
}

function mixinValue<TValue, T extends MixinBase<LitElement>>(
  initialValue: TValue | null,
  type: typeof String | typeof Number | typeof Boolean,
  base: T
): MixinReturn<T, ValueElement<TValue>> {
  abstract class Mixin extends base implements ValueElement<TValue> {
    @property({ type, reflect: true })
    @property$()
    value: TValue | null = initialValue;
    value$!: Observable<TValue | null>;

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

export function mixinStringValue<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, ValueElement<string | null>> {
  const _base = mixinValue<string, T>(null, String, base);
  abstract class Mixin extends _base implements ValueElement<string> {}
  return Mixin;
}

export function mixinNumberValue<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, ValueElement<number | null>> {
  const _base = mixinValue<number, T>(null, Number, base);
  abstract class Mixin extends _base implements ValueElement<number> {}
  return Mixin;
}

export function mixinBooleanValue<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, ValueElement<boolean>> {
  const _base = mixinValue<boolean, T>(false, Number, base);
  abstract class Mixin extends _base implements ValueElement<boolean> {}
  return Mixin;
}
