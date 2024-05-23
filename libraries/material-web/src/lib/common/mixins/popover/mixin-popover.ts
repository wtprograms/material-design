/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html } from 'lit';
import { MixinBase, MixinReturn } from '../mixin';
import { property, query, queryAssignedElements } from 'lit/decorators.js';
import { Popover } from './popover';
import { mixinOpenable } from '../openable/mixin-openable';
import { mixinAttachable } from '../attachable/mixin-attachable';
import {
  ComputePositionReturn,
  Placement,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import { PopoverTrigger } from './popover-trigger';
import { EASING } from '../../motion/easing';
import { sleep } from '../../promise/sleep';

export function mixinPopover<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Popover> {
  const _base = mixinOpenable(mixinAttachable(base));
  abstract class OpenableMixin extends _base implements Popover {
    @property({ type: String })
    trigger: PopoverTrigger = 'click';

    @property({ type: String })
    placement: Placement = 'bottom';

    @property({ type: Number })
    offset = 8;

    @property({ type: Boolean, attribute: 'stay-open-on-outside-click' })
    stayOpenOnOutsideClick = false;

    @property({ type: Boolean, attribute: 'animate-width' })
    animateWidth = false;

    @queryAssignedElements({ flatten: true })
    slots!: HTMLElement[];

    @query('.body')
    body!: HTMLDivElement | null;

    private _cancelAutoUpdate?: () => void;
    currentPlacement: Placement = this.placement;
    private _hovering = false;

    constructor() {
      super();
      this.initialize('click', 'pointerenter', 'pointerleave', 'contextmenu');
    }

    override render() {
      return html`<div class="modal">
        <div class="container">
          <md-elevation level="3"></md-elevation>
        </div>
        <div class="body">
          <slot @close-popover=${this.close}></slot>
        </div>
      </div>`;
    }

    override async handleShow(...args: any[]): Promise<boolean> {
      this.style.display = 'flex';

      await this.updatePosition();
      await this.animateOpen();
      this._cancelAutoUpdate = autoUpdate(
        this.control!,
        this,
        this.updatePosition.bind(this),
        {
          elementResize: false,
          animationFrame: false,
        }
      );
      this.style.opacity = '1';
      return true;
    }

    override async handleClose(): Promise<boolean> {
      this._cancelAutoUpdate?.();
      await this.animateClose();
      this.style.opacity = '0';
      this.style.display = '';
      return true;
    }

    override async animateOpen(): Promise<void> {
      this.cancelAnimations();
      this.animateHost(true);
      this.animateBody(true);
      await this.animationsPromise();
    }

    override async animateClose(): Promise<void> {
      this.cancelAnimations();
      this.animateHost(false);
      this.animateBody(false);
      await this.animationsPromise();
    }

    private animateHost(open: boolean) {
      const opacity = open ? [0, 1] : [1, 0];
      const easing = open
        ? EASING.standard.decelerate
        : EASING.standard.accelerate;
      const duration = open ? 150 : 100;

      this.animations.push(
        this.animate(
          {
            opacity,
          },
          {
            duration,
            easing,
            fill: 'forwards',
          }
        )
      );
    }

    private animateBody(open: boolean) {
      const opacity = open ? [0, 1] : [1, 0];
      const height = open
        ? ['0', `${this.body!.offsetHeight}px`]
        : [`${this.body!.offsetHeight}px`, '0'];
      let width: string[] = [];
      if (this.animateWidth) {
        width = open
          ? ['0', `${this.body!.offsetWidth}px`]
          : [`${this.body!.offsetWidth}px`, '0'];
      }
      const easing = open
        ? EASING.standard.decelerate
        : EASING.standard.accelerate;
      const duration = open ? 150 : 100;

      this.animations.push(
        this.body!.animate(
          {
            opacity,
            height,
            width,
          },
          {
            duration,
            easing,
            fill: 'forwards',
          }
        )
      );
    }

    override async handleControlEvent(event: Event): Promise<void> {
      if (
        (event.type === 'click' && this.trigger === 'click') ||
        (event.type === 'pointerenter' && this.trigger === 'hover') ||
        (event.type === 'contextmenu' && this.trigger === 'contextmenu')
      ) {
        await sleep(100);
        if (!this.open && !this._hovering) {
          this.open = true;
        }
        this._hovering = true;
      }

      if (event.type === 'pointerleave' && this.trigger === 'hover') {
        this._hovering = false;
        await sleep(100);
        if (this.open) {
          this.open = false;
        }
      }
    }

    async updatePosition(): Promise<void> {
      this.cancelAnimations();
      await sleep(100);
      const result = await this.getPosition();
      if (
        this.currentPlacement.includes('top') ||
        this.currentPlacement === 'left-end' ||
        this.currentPlacement === 'right-end'
      ) {
        this.style.bottom =
          this.control!.parentElement!.clientHeight -
          this.control!.offsetTop +
          this.offset +
          'px';
        this.style.top = '';
      } else {
        this.style.bottom = '';
        this.style.top = `${result.y}px`;
      }

      if (this.currentPlacement.includes('left')) {
        this.style.right =
          this.control!.parentElement!.clientWidth -
          this.control!.offsetLeft +
          this.offset +
          'px';
        this.style.left = '';
      } else {
        this.style.right = '';
        this.style.left = `${result.x}px`;
      }
    }

    async getPosition(): Promise<ComputePositionReturn> {
      const result = await computePosition(this.control!, this, {
        placement: this.placement,
        middleware: [offset(this.offset), flip(), shift()],
        strategy: 'absolute',
      });
      this.currentPlacement = result.placement;
      return result;
    }
  }

  return OpenableMixin;
}
