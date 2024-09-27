import { html, PropertyValues } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinAttachable, ObservableElement, PopoverTrigger } from '../../common';
import { MdPopoverElement } from '../popover';
import { Placement } from '@floating-ui/dom';

const base = mixinAttachable(ObservableElement);

@customElement('md-tooltip')
export class MdTooltipElement extends base {
  static override styles = [styles];

  @property({ type: String })
  placement: Placement = 'bottom';

  @property({ type: String })
  trigger: PopoverTrigger = 'hover';

  @property({ type: Boolean, reflect: true })
  rich = false;

  @property({ type: Boolean, attribute: 'manual-close' })
  manualClose = false;

  @query('md-popover')
  private _popover!: MdPopoverElement;

  @property({ type: Boolean, reflect: true})
  headline = false;

  @queryAssignedElements({ slot: 'headline', flatten: true })
  private readonly _headlineSlotElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true})
  actions = false;

  @property({ type: Number, attribute: 'delay' })
  delay = 1000;

  @queryAssignedElements({ slot: 'action', flatten: true })
  private readonly _actionSlotElements!: HTMLElement[];

  get open() {
    return this._popover.open;
  }
  set open(value: boolean) {
    this._popover.open = value;
  }

  constructor() {
    super();
    this.initialize(
      'click',
      'pointerdown',
      'pointerenter',
      'pointerleave',
      'contextmenu',
      'focusin',
      'focusout'
    );
    this.addEventListener('for-change', this.handleForChange.bind(this));
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.handleForChange();
  }

  override render() {
    const content = this.rich
      ? this.renderRichContent()
      : html`<slot></slot>`;
    return html`<md-popover
      offset="8"
      shift
      flip
      native
      placement=${this.placement}
      trigger=${this.trigger}
      ?manual-close=${this.manualClose}
      delay=${this.delay}
    >
      ${content}
    </md-popover>`;
  }

  private renderRichContent() {
    return html`<div class="headline">
        <slot
          name="headline"
          @slotchange=${() =>
            (this.headline = !!this._headlineSlotElements.length)}
        ></slot>
      </div>
      <div class="supporting-text">
        <slot></slot>
      </div>
      <div class="actions">
        <slot
          name="action"
          @slotchange=${() =>
            (this.actions = !!this._actionSlotElements.length)}
          @click=${() => (this.open = false)}
        ></slot>
      </div>`;
  }

  openTooltip() {
    this._popover.openComponent();
  }

  closeTooltip() {
    this._popover.closeComponent();
  }

  private handleForChange() {
    if (this._popover.control !== this.control) {
      this._popover.attachControl(this.control);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-tooltip': MdTooltipElement;
  }
}
