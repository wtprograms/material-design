import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { MixinBase, MixinReturn } from './mixin';

export interface Popup {
  opening: boolean;
  closing: boolean;
  open: boolean;
  showComponent(): Promise<void>;
  closeComponent(): Promise<void>;
  animateComponent(): Promise<void>;
  getComponentAnimations(): Generator<Animation | undefined>;
}

export function mixinPopup<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Popup> {
  abstract class Mixin extends base implements Popup {
    @property({ type: Boolean, reflect: true })
    opening = false;

    @property({ type: Boolean, reflect: true })
    closing = false;

    @property({ type: Boolean, reflect: true, noAccessor: true })
    get open(): boolean {
      return this.getAttribute('open') !== null;
    }
    set open(value: boolean) {
      if (value) {
        this.showComponent();
      } else {
        this.closeComponent();
      }
    }

    private _cancelAnimations?: AbortController;

    abstract showComponent(): Promise<void>;
    abstract closeComponent(): Promise<void>;
    abstract getComponentAnimations(): Generator<Animation | undefined>;

    async animateComponent(): Promise<void> {
      this._cancelAnimations?.abort();
      this._cancelAnimations = new AbortController();
      const animations = Array.from(this.getComponentAnimations()).filter(x => !!x);

      for (const animation of animations) {
        this._cancelAnimations.signal.addEventListener('abort', () =>
          animation!.cancel()
        );
      }

      await Promise.all(
        animations.map((animation) => animation!.finished.catch(() => {}))
      );
    }
  }

  return Mixin;
}
