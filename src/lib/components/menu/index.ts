import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styles } from './styles';
import { mixinAttachable, ObservableElement, PopoverTrigger } from '../../common';
import { Placement } from '@floating-ui/dom';
import { MdPopoverElement } from '../popover';

const base = mixinAttachable(ObservableElement);

@customElement('md-menu')
export class MdMenuElement extends base {
  static override styles = [styles];

  @property({ type: String })
  placement: Placement = 'bottom-start';

  @property({ type: String })
  trigger: PopoverTrigger = 'click';

  @property({ type: Number })
  offset = 8;

  @query('md-popover')
  private _popover!: MdPopoverElement;
    
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
    return html`<md-popover
      offset="${this.offset}"
      shift
      flip
      native
      placement=${this.placement}
      trigger=${this.trigger}
    >
      <slot></slot>
    </md-popover>`;
  }

  openMenu() {
    this._popover.openComponent();
  }

  closeMenu() {
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
    'md-menu': MdMenuElement;
  }
}
