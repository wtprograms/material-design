/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { property } from 'lit/decorators.js';
import { Openable } from './openable';

export function mixinOpenable<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Openable> {
  abstract class OpenableMixin extends base implements Openable {
    @property({ type: Boolean, noAccessor: true })
    get open() {
      return !!this.hasAttribute('open');
    }
    set open(value: boolean) {
      if (value === this.open) {
        return;
      }
      if (value) {
        this.show();
        this.setAttribute('open', '');
      } else {
        this.close();
        this.removeAttribute('open');
      }
    }

    animations: Animation[] = [];

    private _opening = false;
    private _closing = false;

    async show(...args: any[]): Promise<void> {
      if (this.open || this._opening || this._closing) {
        return;
      }
      this._opening = true;
      this.cancelAnimations();

      if (!await this.handleShow(...args)) {
        return;
      }
      this.open = true;
      this._opening = false;
      this.dispatchEvent(new Event('opened'))
    }

    async handleShow(...args: any[]): Promise<boolean> {
      return true;
    }

    async close(...args: any[]): Promise<void> {
      if (!this.open || this._opening || this._closing) {
        return;
      }
      this._closing = true;
      if (!await this.handleClose(...args)) {
        return;
      }
      this.open = false;
      this._closing = false;
      this.dispatchEvent(new Event('closed'))
    }

    async handleClose(...args: any[]): Promise<boolean> {
      return true;
    }

    async animateOpen(): Promise<void> {}

    async animateClose(): Promise<void> {}

    cancelAnimations(): void {
      for (const animation of this.animations) {
        animation.cancel();
      }
      this.animations = [];
    }

    async animationsPromise(): Promise<void> {
      await Promise.all(
        this.animations.map((animation) => animation.finished.catch(() => {}))
      );
    }
  }

  return OpenableMixin;
}
