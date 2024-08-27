import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinAttachablePopover } from '../../common/mixins/mixin-attachable-popover';
import { MdButtonElement } from '../button';

export type TooltipVariant = 'plain' | 'rich';

const base = mixinAttachablePopover(LitElement, {
  trigger: 'hover',
  placement: 'bottom',
});

@customElement('md-tooltip')
export class MdTooltipElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  variant: TooltipVariant = 'plain';

  @property({ type: Boolean, reflect: true, attribute: 'has-headline' })
  hasHeadline = false;

  @queryAssignedElements({ slot: 'headline', flatten: true })
  private readonly _headlineSlotElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-actions' })
  hasActions = false;

  @property({ type: Number, attribute: 'hover-delay' })
  hoverDelay: number | null = 1000;

  @queryAssignedElements({ slot: 'action', flatten: true })
  private readonly _actionSlotElements!: HTMLElement[];

  private _hoverOpenHandle?: unknown;

  get buttons(): MdButtonElement[] {
    return this._actionSlotElements.filter(
      (x) => x instanceof MdButtonElement
    ) as MdButtonElement[];
  }

  override async showComponent(): Promise<void> {
    if (this.open || this.opening) {
      return;
    }
    if (!this.hoverDelay) {
      await super.showComponent();
      return;
    }
    if (this._hoverOpenHandle) {
      return;
    }
    this._hoverOpenHandle = setTimeout(
      () => super.showComponent(),
      this.hoverDelay
    );
  }

  override async closeComponent(): Promise<void> {
    if (this._hoverOpenHandle) {
      clearTimeout(this._hoverOpenHandle as number);
      this._hoverOpenHandle = undefined;
    }
    await super.closeComponent();
  }

  override render(): unknown {
    return html`${this.renderPopover()}`;
  }

  override renderPopoverContent(): unknown {
    if (this.variant === 'plain') {
      return html`<slot></slot>`;
    }

    return html`<div class="headline">
        <slot name="headline" @slotchange=${this.onSlotChange}></slot>
      </div>
      <div class="supporting-text">
        <slot></slot>
      </div>
      <div class="actions">
        <slot
          name="action"
          @slotchange=${this.onSlotChange}
          @click=${this.onClosePopup}
        ></slot>
      </div>`;
  }

  private onSlotChange() {
    this.hasHeadline = this._headlineSlotElements.length > 0;
    this.hasActions = this._actionSlotElements.length > 0;

    for (const button of this.buttons) {
      button.variant = 'text';
    }
  }

  override async handlePointerLeave(): Promise<void> {
    if (this.variant === 'rich' && this.closeOnAction) {
      return;
    }
    await super.handlePointerLeave();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-tooltip': MdTooltipElement;
  }
}
