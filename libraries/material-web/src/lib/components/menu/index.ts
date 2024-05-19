import { LitElement, html, isServer } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import style from './index.scss';
import { EASING, FocusState, mixinAttachable } from '../../common';
import { MdMenuItemElement } from '../menu-item';
import { MenuTrigger } from './menu-trigger';
import { Placement, autoPlacement, autoUpdate } from '@floating-ui/dom';
import { computePosition, offset } from '@floating-ui/dom';
import { mixinOpenable } from '../../common/mixins/openable/mixin-openable';
import { MdDividerElement } from '../divider';

const base = mixinAttachable(mixinOpenable(LitElement));

@customElement('md-menu')
export class MdMenuElement extends base {
  static override styles = [style];

  @property({ type: String })
  trigger: MenuTrigger = 'click';

  @property({ type: String })
  placement: Placement = 'bottom-start';

  @property({ type: Number })
  offset = 8;

  @queryAssignedElements({ flatten: true })
  private readonly _slots!: HTMLElement[];

  @property({ type: Boolean, attribute: 'stay-open-on-outside-click' })
  stayOpenOnOutsideClick = false;

  @property({ type: Boolean, attribute: 'stay-open-on-focusout' })
  stayOpenOnFocusout = false;

  @property({ type: Boolean, attribute: 'skip-restore-focus' })
  skipRestoreFocus = false;

  @property({ attribute: 'default-focus' })
  defaultFocus: FocusState = FocusState.FirstItem;

  @query('.container-paint')
  private readonly _containerPaint!: HTMLElement | null;

  get items(): MdMenuItemElement[] {
    return this._slots.filter(
      (el) => el instanceof MdMenuItemElement
    ) as MdMenuItemElement[];
  }

  get itemsAndDividers(): (MdMenuItemElement | MdDividerElement)[] {
    return this._slots.filter(
      (el) => el instanceof MdMenuItemElement || el instanceof MdDividerElement
    ) as (MdMenuItemElement | MdDividerElement)[];
  }

  private readonly internals = (this as HTMLElement).attachInternals();

  private _pointerPath: EventTarget[] = [];
  private _cancelAutoUpdate?: () => void;
  private _cancelGlobalEventListeners?: () => void;
  private _animations: Animation[] = [];
  private _positionPlacement = this.placement;

  constructor() {
    super();
    this.initialize('click', 'pointerenter', 'pointerleave', 'contextmenu');
    if (!isServer) {
      this.internals.role = 'menu';
    }
  }

  override render() {
    return html`<div class="container">
      <div class="container-paint">
        <md-elevation level="3"></md-elevation>
      </div>
      <slot></slot>
    </div> `;
  }

  override async handleControlEvent(event: Event): Promise<void> {
    if (
      (event.type === 'click' && this.trigger === 'click') ||
      (event.type === 'mouseenter' && this.trigger === 'hover') ||
      (event.type === 'contextmenu' && this.trigger === 'contextmenu')
    ) {
      this.open = true;
    }
  }

  private async animateOpen() {
    for (const animation of this._animations) {
      animation.cancel();
    }
    this._animations = [];
    this._animations.push(
      this.animate(
        {
          opacity: [0, 1],
        },
        {
          duration: 200,
          easing: EASING.standard.decelerate,
          fill: 'forwards',
        }
      )
    );
    this._animations.push(
      this._containerPaint!.animate(
        {
          height: ['35%', '100%'],
        },
        {
          duration: 200,
          easing: EASING.standard.decelerate,
          fill: 'forwards',
        }
      )
    );
    const amount = this._positionPlacement.includes('top') ? 16 : -16;
    for (const item of this.itemsAndDividers) {
      this._animations.push(
        item.animate(
          {
            transform: [`translateY(${amount}px)`, 'translateY(0)'],
            opacity: [0, 1],
          },
          {
            duration: 150,
            easing: EASING.standard.decelerate,
            fill: 'forwards',
          }
        )
      );
    }

    await Promise.all(
      this._animations.map((animation) => animation.finished.catch(() => {}))
    );
  }

  private async animateClose() {
    for (const animation of this._animations) {
      animation.cancel();
    }
    this._animations = [];

    const amount = this._positionPlacement === 'top' ? 16 : -16;
    for (const item of this.itemsAndDividers) {
      this._animations.push(
        item.animate(
          {
            transform: ['translateY(0)', `translateY(${amount}px)`],
            opacity: [1, 0],
          },
          {
            duration: 150,
            easing: EASING.standard.accelerate,
            fill: 'forwards',
          }
        )
      );
    }
    this._animations.push(
      this.animate(
        {
          opacity: [1, 0],
        },
        {
          duration: 200,
          easing: EASING.standard.accelerate,
          fill: 'forwards',
        }
      )
    );
    this._animations.push(
      this._containerPaint!.animate(
        {
          height: ['100%', '35%'],
        },
        {
          duration: 200,
          easing: EASING.standard.accelerate,
          fill: 'forwards',
        }
      )
    );

    await Promise.all(
      this._animations.map((animation) => animation.finished.catch(() => {}))
    );
  }

  override async show() {
    if (this.opening) {
      return;
    }
    this.opening = true;
    this.style.display = 'flex';
    this.style.opacity = '1';
    await this.updatePosition();
    this._cancelAutoUpdate = autoUpdate(
      this.control!,
      this,
      this.updatePosition.bind(this)
    );
    this._cancelGlobalEventListeners = this.setUpGlobalEventListeners();
    await this.animateOpen();
    this.open = true;
    this.opening = false;
  }

  override async close() {
    if (this.closing) {
      return;
    }
    this.closing = true;
    this._cancelAutoUpdate?.();
    this._cancelGlobalEventListeners?.();
    await this.animateClose();
    this.style.display = '';
    this.style.opacity = '';
    this.open = false;
    this.closing = false;
  }

  private async updatePosition() {
    const result = await computePosition(this.control!, this, {
      placement: this.placement,
      middleware: [offset(this.offset), autoPlacement()],
      strategy: 'absolute',
    });

    this._positionPlacement = result.placement;
    if (this._positionPlacement.includes('top')) {
      this.style.top = 'auto';
      this.style.bottom =
        this.control!.parentElement!.clientHeight -
        this.control!.offsetTop +
        this.offset +
        'px';
      this.style.setProperty('--_container-paint-inset', 'auto 0 0 0');
      this;
    } else {
      this.style.top = `${result.y}px`;
      this.style.setProperty('--_container-paint-inset', '0');
    }
    this.style.left = `${result.x}px`;
  }

  private setUpGlobalEventListeners(): () => void {
    const documentClick = this.onDocumentClick.bind(this);
    const windowPointerdown = this.onWindowPointerdown.bind(this);

    document.addEventListener('click', documentClick, { capture: true });
    window.addEventListener('pointerdown', windowPointerdown);

    return () => {
      document.removeEventListener('click', documentClick);
      window.removeEventListener('pointerdown', windowPointerdown);
    };
  }

  private onDocumentClick(event: Event) {
    if (!this.open) {
      return;
    }

    const path = event.composedPath();

    if (
      !this.stayOpenOnOutsideClick &&
      !path.includes(this) &&
      !path.includes(this.control!)
    ) {
      this.open = false;
    }
  }

  private onWindowPointerdown(event: Event) {
    this._pointerPath = event.composedPath();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-menu': MdMenuElement;
  }
}
