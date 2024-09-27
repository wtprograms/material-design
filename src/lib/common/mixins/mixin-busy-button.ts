import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';
import { ButtonElement, mixinButton } from './mixin-button';
import { ObservableElement } from '../lit/observable-element';

export interface BusyButtonElement extends ButtonElement {
  busy: boolean;
  progress: number;
  max: number;
  fourColor: boolean;
  indeterminate: boolean;
  buffer: number;
  renderProgressIndicator(): unknown;
}

export function mixinBusyButton<T extends MixinBase<ObservableElement>>(
  base: T
): MixinReturn<T, BusyButtonElement> {
  const _base = mixinButton(base);
  abstract class Mixin extends _base implements BusyButtonElement {
    @property({ type: Boolean, reflect: true })
    busy = false;

    @property({ type: Number })
    progress = 0;

    @property({ type: Number })
    max = 1;

    @property({ type: Boolean })
    indeterminate = false;

    @property({ type: Boolean })
    fourColor = false;

    @property({ type: Number })
    buffer = 0;

    renderProgressIndicator() {
      return this.busy && !this.disabled
        ? html`<div class="progress-indicator">
            <md-progress-indicator
              ?indeterminate=${this.indeterminate}
              value=${this.progress}
              max=${this.max}
              ?four-color=${this.fourColor}
              buffer=${this.buffer}
            ></md-progress-indicator>
          </div>`
        : nothing;
    }
  }

  return Mixin;
}
