import { html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { ButtonElement, mixinButton } from './mixin-button';

export interface BusyButtonElement extends ButtonElement {
  busy: boolean;
  renderProgressIndicator(): unknown;
}

export function mixinBusyButton<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, BusyButtonElement> {
  const _base = mixinButton(base);
  abstract class Mixin extends _base implements BusyButtonElement {
    @property({ type: Boolean, reflect: true })
    busy = false;

    renderProgressIndicator() {
      return this.busy && !this.disabled
        ? html`<div class="progress-indicator">
            <md-progress-indicator indeterminate></md-progress-indicator>
          </div>`
        : nothing;
    }
  }

  return Mixin;
}
