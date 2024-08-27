import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinPopover } from '../../common';

const base = mixinPopover(LitElement);

@customElement('md-snack-bar')
export class MdSnackBarElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true, attribute: 'has-actions' })
  hasActions = false;

  @queryAssignedElements({ slot: 'action', flatten: true })
  private readonly _actionSlotElements!: HTMLElement[];

  @property({ type: Number })
  timeout = 5000;

  @property({ type: Boolean, reflect: true })
  multiline = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _hideHandle?: any;

  override render(): unknown {
    return html`${this.renderPopover()}`;
  }

  override renderPopoverContent(): unknown {
    return html` <div class="body">
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

  override async showComponent(): Promise<void> {
    if (this._hideHandle) {
      clearTimeout(this._hideHandle);
    }
    this._hideHandle = setTimeout(() => this.closeComponent(), this.timeout);
    await super.showComponent();
  }

  override async closeComponent(): Promise<void> {
    clearTimeout(this._hideHandle);
    await super.closeComponent();
  }

  private onSlotChange() {
    this.hasActions = this._actionSlotElements.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-snack-bar': MdSnackBarElement;
  }
}
