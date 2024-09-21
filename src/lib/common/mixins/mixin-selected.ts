import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { property$ } from '../lit/property$.decorator';

export interface SelectedElement {
  selected: boolean;
  selected$: Observable<boolean>;
}

export function mixinSelected<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, SelectedElement> {
  abstract class Mixin extends base implements SelectedElement {
    @property({ type: Boolean, reflect: true })
    @property$()
    selected = false
    selected$!: Observable<boolean>;

    override connectedCallback(): void {
      super.connectedCallback();
      this.selected$
        .pipe(
          distinctUntilChanged(),
          tap(() => this.dispatchEvent(new Event('selected-change', { bubbles: true})))
        )
        .subscribe();
    }
  }

  return Mixin;
}
