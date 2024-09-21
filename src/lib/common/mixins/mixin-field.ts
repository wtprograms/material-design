import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { Observable } from 'rxjs';
import { property$ } from '../lit/property$.decorator';

export type FieldVariant = 'filled' | 'outlined';

export interface FieldElement {
  variant: FieldVariant;
  label: string | null;
  label$: Observable<string | null>;
  supportingText: string | null;
  errorText: string | null;
  prefixText: string | null;
  suffixText: string | null;
}

export function mixinField<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, FieldElement> {
  abstract class Mixin extends base implements FieldElement {
    @property({ type: String })
    variant: FieldVariant = 'filled';

    @property({ type: String })
    @property$()
    label: string | null = null;
    label$!: Observable<string | null>;

    @property({ type: String, attribute: 'supporting-text' })
    supportingText: string | null = null;

    @property({ type: String, attribute: 'error-text' })
    errorText: string | null = null;
 
    @property({ type: String, attribute: 'prefix-text' })
    prefixText: string | null = null;
  
    @property({ type: String, attribute: 'suffix-text' })
    suffixText: string | null = null;
   }

  return Mixin;
}
