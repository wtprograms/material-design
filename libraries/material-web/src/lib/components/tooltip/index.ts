import { LitElement, isServer } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './index.scss';
import { PopoverTrigger, mixinPopover } from '../../common';
import { MdMenuItemElement } from '../menu-item';
import { MdDividerElement } from '../divider';

const base = mixinPopover(LitElement);

@customElement('md-tooltip')
export class MdTooltip extends base {
  static override styles = [style];

  @property({ type: String, reflect: true })
  override trigger: PopoverTrigger = 'hover';

  get items(): MdMenuItemElement[] {
    return this.slots.filter(
      (el) => el instanceof MdMenuItemElement
    ) as MdMenuItemElement[];
  }

  get itemsAndDividers(): (MdMenuItemElement | MdDividerElement)[] {
    return this.slots.filter(
      (el) => el instanceof MdMenuItemElement || el instanceof MdDividerElement
    ) as (MdMenuItemElement | MdDividerElement)[];
  }

  private readonly internals = (this as HTMLElement).attachInternals();

  private _pointerPath: EventTarget[] = [];
  private _cancelGlobalEventListeners?: () => void;

  constructor() {
    super();
    this.initialize('click', 'pointerenter', 'pointerleave', 'contextmenu');
    if (!isServer) {
      this.internals.role = 'menu';
    }
  }

  override async handleShow() {
    if (!(await super.handleShow())) {
      return false;
    }
    this._cancelGlobalEventListeners = this.setUpGlobalEventListeners();
    return true;
  }

  override async handleClose() {
    if (!(await super.handleClose())) {
      return false;
    }
    this._cancelGlobalEventListeners?.();
    return true;
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
    'md-tooltip': MdTooltip;
  }
}
