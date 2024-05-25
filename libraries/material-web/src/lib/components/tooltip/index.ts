import { LitElement, TemplateResult, html, isServer } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import style from './index.scss';
import { PopoverTrigger, mixinPopover } from '../../common';
import { MdMenuItemElement } from '../menu-item';
import { MdDividerElement } from '../divider';

const base = mixinPopover(LitElement);

@customElement('md-tooltip')
export class MdTooltipElement extends base {
  static override styles = [style];

  @property({ type: String, reflect: true })
  override trigger: PopoverTrigger = 'hover';

  @property({ type: Boolean, reflect: true })
  rich = false;

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

  @queryAssignedElements({ slot: 'headline', flatten: true })
  private readonly _headlineSlots!: HTMLSpanElement[];

  @property({ type: Boolean, attribute: 'has-headline', reflect: true })
  hasHeadline = false;

  @queryAssignedElements({ slot: 'action', flatten: true })
  private readonly _actionSlots!: HTMLElement[];

  @property({ type: Boolean, attribute: 'has-actions', reflect: true })
  hasActions = false;

  private _cancelGlobalEventListeners?: () => void;

  constructor() {
    super();
    this.initialize('click', 'pointerenter', 'pointerleave', 'contextmenu');
    if (!isServer) {
      this.internals.role = 'tooltip';
    }
  }

  override renderContent(): TemplateResult {
    return html`<span class="headline" ?hidden=${!this
      .hasHeadline}><slot name="headline" @slotchange=${
      this.onSlotChange
    }></span></div>
          <slot></slot>
          <span class="actions" ?hidden=${!this
            .hasActions}><slot name="action" @slotchange=${
      this.onSlotChange
    }></span>`;
  }

  override async handleOpen(event: Event, value: boolean): Promise<void> {
    if (event.type === 'pointerleave' && this.rich && this.hasActions) {
      return;
    }
    await super.handleOpen(event, value);
  }

  private onSlotChange() {
    this.hasHeadline = this._headlineSlots.length > 0;
    this.hasActions = this._actionSlots.length > 0;
    this.rich = this.hasHeadline || this.hasActions;
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

    document.addEventListener('click', documentClick, { capture: true });

    return () => {
      document.removeEventListener('click', documentClick);
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
}

declare global {
  interface HTMLElementTagNameMap {
    'md-tooltip': MdTooltipElement;
  }
}
