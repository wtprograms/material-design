import { html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { Button, mixinButton } from './mixin-button';

export interface BusyButton extends Button {
  busy: boolean;
  renderProgressIndicator(): unknown;
}

export function mixinBusyButton<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, BusyButton> {
  const _base = mixinButton(base);
  abstract class Mixin extends _base implements BusyButton {
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
