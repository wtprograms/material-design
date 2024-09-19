import { LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { property$ } from '../lit/property$.decorator';

export interface ValueElement {
  value: string | null;
  value$: Observable<string | null>;
}

export function mixinValueElement<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, ValueElement> {
  abstract class Mixin extends base implements ValueElement {
    @property({ type: String, reflect: true })
    @property$()
    value: string | null = '';
    value$!: Observable<string | null>;

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
