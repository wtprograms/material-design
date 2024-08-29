import { html, LitElement, nothing } from 'lit';
import { MixinBase, MixinReturn } from './mixin';
import { Placement, Strategy } from '@floating-ui/dom';
import { property, query } from 'lit/decorators.js';
import { EASING } from '../motion/easing';
import { mixinPopup, Popup } from './mixin-popup';
import { sleep } from '../promise/sleep';

export interface Popover extends Popup {
  placement: Placement;
  resultTransformOrigin: Placement;
  strategy: Strategy;
  offset: number;
  closeOnAction: boolean;
  open: boolean;
  popoverContainer: HTMLElement;
  popoverBody: HTMLElement;
  renderPopover(): unknown;
  renderPopoverContent(): unknown;
  updatePosition(): Promise<void>;
  setTransformOrigin(): void;
  animateContainer(): Animation;
  animateBody(): Animation;
  getComponentAnimations(): Generator<Animation>;
  onClosePopup(): Promise<void>;
  renderFooter(): unknown;
}

export interface PopoverOptions {
  placement?: Placement;
  strategy?: Strategy;
  offset?: number;
  closeOnAction?: boolean;
}

export const DEFAULT_POPOVER_OPTIONS: PopoverOptions = {
  placement: 'bottom-start',
  strategy: 'absolute',
  offset: 8,
  closeOnAction: false,
};

export function mixinPopover<T extends MixinBase<LitElement>>(
  base: T,
  options: PopoverOptions = DEFAULT_POPOVER_OPTIONS
): MixinReturn<T, Popover> {
  const _base = mixinPopup(base);
  abstract class Mixin extends _base implements Popover {
    @property({ type: String, reflect: true })
    placement: Placement = options.placement ?? 'bottom-start';

    @property({ type: Boolean, reflect: true, attribute: 'non-native' })
    nonNative = false;

    @property({ type: String, reflect: true })
    strategy: Strategy = options.strategy ?? 'absolute';

    @property({ type: Number })
    offset = options.offset ?? 8;

    @property({ type: Boolean, reflect: true, attribute: 'close-on-action' })
    closeOnAction = false;

    @query('.popover-container')
    popoverContainer!: HTMLElement;

    @query('.popover-body')
    popoverBody!: HTMLElement;

    resultTransformOrigin = this.placement;

    override connectedCallback() {
      if (!this.nonNative) {
        this.popover = 'manual';
      }
      super.connectedCallback();
    }

    override async showComponent() {
      if (this.open || this.opening) {
        return;
      }
      this.opening = true;
      this.dispatchEvent(new Event('opening', { bubbles: true }));
      this.style.display = 'flex';
      this.setAttribute('open', '');
      if (!this.nonNative) {
        this.showPopover();
      }
      await this.updatePosition();
      this.style.opacity = '1';
      await this.animateComponent();
      this.opening = false;
      this.dispatchEvent(new Event('opened', { bubbles: true }));
    }

    override async closeComponent() {
      if (!this.open || this.closing) {
        return;
      }
      this.closing = true;
      this.dispatchEvent(new Event('closing', { bubbles: true }));
      await this.animateComponent();
      this.style.opacity = '';
      this.style.display = '';
      this.removeAttribute('open');
      if (!this.nonNative) {
        this.hidePopover();
      }
      this.closing = false;

      this.style.left = '';
      this.style.top = '';
      this.style.right = '';
      this.style.bottom = '';
      this.dispatchEvent(new Event('closed', { bubbles: true }));
    }

    async onClosePopup() {
      await this.closeComponent();
    }

    renderPopover(): unknown {
      return html`<div class="popover-container">
          <md-elevation level="2"></md-elevation>
        </div>
        <div class="popover-body">${this.renderPopoverContent()}</div>${this.renderFooter()}`;
    }

    renderPopoverContent(): unknown {
      return html`<slot @close-popover=${this.onClosePopup}></slot>`;
    }

    renderFooter(): unknown {
      return nothing;
    }

    async updatePosition(): Promise<void> {}

    abstract setTransformOrigin(): void;

    override *getComponentAnimations() {
      yield this.animateContainer();
      yield this.animateBody();
    }

    animateBody() {
      let opacity = ['0', '1'];
      if (this.closing) {
        opacity = opacity.reverse();
      }

      const easing = this.opening
        ? EASING.standard.decelerate
        : EASING.standard.accelerate;
      const duration = this.opening ? 300 : 50;

      return this.popoverBody.animate(
        {
          opacity,
        },
        {
          easing,
          duration,
          fill: 'forwards',
        }
      );
    }

    animateContainer() {
      let transform = ['scaleY(30%)', 'scaleY(100%)'];
      let opacity = ['0', '1'];
      if (this.closing) {
        transform = transform.reverse();
        opacity = opacity.reverse();
      }

      const easing = this.opening
        ? EASING.standard.decelerate
        : EASING.standard.accelerate;
      const duration = this.opening ? 300 : 150;

      return this.popoverContainer.animate(
        {
          transform,
          opacity,
        },
        {
          easing,
          duration,
          fill: 'forwards',
        }
      );
    }
  }
  return Mixin;
}
