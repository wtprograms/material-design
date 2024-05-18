import { LitElement, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './index.scss';
import { AutoResetEvent, DURATION, EASING, mixinOpenable } from '../../common';

const base = mixinOpenable(LitElement);

@customElement('md-scrim')
export class MdScrimElement extends base {
  static override styles = [style];

  private static _scrimCounter = 0;

  private _animation?: Animation;

  override render() {
    return nothing;
  }

  override async hide() {
    if (!this.open) {
      return;
    }
    this._animation?.cancel();
    this._animation = this.animate(
      {
        opacity: [0.3, 0],
      },
      {
        duration: DURATION.short[4],
        easing: EASING.standard.accelerate,
        fill: 'forwards',
      }
    );
    const latch = new AutoResetEvent();
    this._animation.onfinish = () => latch.set();
    await latch.waitOne();
    this.style.display = 'none';
    MdScrimElement._scrimCounter--;
    if (MdScrimElement._scrimCounter === 0) {
      document.body.style.overflow = '';
    }
  }

  override async show() {
    if (!this.open) {
      return;
    }

    this._animation?.cancel();
    this.style.display = 'block';
    this._animation = this.animate(
      {
        opacity: [0, 0.3],
      },
      {
        duration: DURATION.short[4],
        easing: EASING.standard.decelerate,
        fill: 'forwards',
      }
    );
    MdScrimElement._scrimCounter++;
    if (MdScrimElement._scrimCounter === 1) {
      document.body.style.overflow = 'hidden';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-scrim': MdScrimElement;
  }
}
