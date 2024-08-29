import { LitElement } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { Control, mixinControl } from './mixin-control';

export type FieldVariant = 'filled' | 'outlined';

export interface Field extends Control {
  variant: FieldVariant;
  label: string | null;
  populated: boolean;
  required: boolean;
  prefixText: string | null;
  suffixText: string | null;
  supportingText: null | string;
  errorText: null | string;
  counterText: null | string;
  hasLeading: boolean;
  hasTrailing: boolean;
  leadingSlots: HTMLElement[];
  trailingSlots: HTMLElement[];
  onLeadingAndTrailingSlotChange(): void;
}

export function mixinField<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Field> {
  const _base = mixinControl(base);
  abstract class Mixin extends _base implements Field {
    @property({ type: String, reflect: true })
    variant: FieldVariant = 'filled';

    @property({ type: String })
    label: null | string = null;

    @property({ type: Boolean })
    populated = false;

    @property({ type: Boolean })
    required = false;

    @property({ type: String, reflect: true, attribute: 'prefix-text' })
    prefixText: null | string = null;

    @property({ type: String, reflect: true, attribute: 'suffix-text' })
    suffixText: null | string = null;

    @property({ type: String, reflect: true, attribute: 'supporting-text' })
    supportingText: null | string = null;

    @property({ type: String, reflect: true, attribute: 'error-text' })
    errorText: null | string = null;

    @property({ type: String, reflect: true, attribute: 'counter-text' })
    counterText: null | string = null;

    @property({ type: Boolean, reflect: true, attribute: 'has-leading' })
    hasLeading = false;

    @property({ type: Boolean, reflect: true, attribute: 'has-trailing' })
    hasTrailing = false;

    @queryAssignedElements({ slot: 'leading', flatten: true })
    leadingSlots!: HTMLElement[];
  
    @queryAssignedElements({ slot: 'trailing', flatten: true })
    trailingSlots!: HTMLElement[];

    onLeadingAndTrailingSlotChange() {
      this.hasLeading = this.leadingSlots.length > 0;
      this.hasTrailing = this.trailingSlots.length > 0;
    }
  }

  return Mixin;
}
