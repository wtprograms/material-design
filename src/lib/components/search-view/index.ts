import { html, isServer, LitElement } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { DURATION, EASING, mixinPopup, redispatchEvent } from '../../common';

const base = mixinPopup(LitElement);

@customElement('md-search-view')
export class MdSearchViewElement extends base {
  static override styles = [styles];

  @query('dialog')
  private _dialog!: HTMLDialogElement;

  @query('.container')
  private _container!: HTMLDivElement;

  @queryAssignedElements({ slot: 'body', flatten: true })
  private _bodySlots!: HTMLElement[];

  @queryAssignedElements({ slot: 'item', flatten: true })
  private _itemSlots!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-items' })
  hasItems = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-body' })
  hasBody = false;

  @property({ type: Boolean, reflect: true })
  searching = false;

  @query('.input')
  private _input!: HTMLInputElement;

  override render() {
    return html` <dialog>
      <div class="container">
        <div class="search-header">
          <md-icon-button @click=${this.onBackClick}>
            <md-icon>arrow_back</md-icon>
          </md-icon-button>
          <input class="input" @input=${this.onInput} />
        </div>
        <md-progress-indicator
          variant="linear"
          indeterminate
        ></md-progress-indicator>
        <div class="contents">
          <div class="body">
            <slot name="body" @slotchange=${this.onSlotChange}></slot>
          </div>
          <md-list>
            <slot name="item" @slotchange=${this.onSlotChange}></slot>
          </md-list>
        </div>
      </div>
    </dialog>`;
  }

  private onInput(event: InputEvent) {
    redispatchEvent(this, event);
  }

  private onBackClick() {
    this.open = false;
  }

  override async showComponent() {
    if (!isServer) {
      document.body.style.overflow = 'hidden';
    }
    this.opening = true;
    this.setAttribute('open', '');
    this._dialog.showModal();
    await this.animateComponent();
    this.opening = false;
    this._input.focus();
  }

  override async closeComponent() {
    this.closing = true;
    await this.animateComponent();
    if (!isServer) {
      document.body.style.overflow = '';
    }
    this.removeAttribute('open');
    this._dialog.close();
    this.closing = false;
    this.dispatchEvent(new Event('closed', { bubbles: true }));
  }

  override *getComponentAnimations() {
    yield this.animateContainer();
    yield this.animateContainerBefore();
  }

  private animateContainer(): Animation {
    let opacity = ['0', '1'];
    const easing = this.opening
      ? EASING.emphasized.decelerate
      : EASING.emphasized.accelerate;
    const duration = this.opening ? DURATION.long[1] : DURATION.short[3];
    if (this.closing) {
      opacity = opacity.reverse();
    }
    return this._container.animate(
      { opacity },
      { duration, easing, fill: 'forwards' }
    );
  }

  private animateContainerBefore(): Animation {
    let height = ['35%', '100%'];
    const easing = this.opening
      ? EASING.emphasized.decelerate
      : EASING.emphasized.accelerate;
    const duration = this.opening ? DURATION.long[4] : DURATION.short[3];
    if (this.closing) {
      height = height.reverse();
    }
    return this._container.animate(
      { height },
      { duration, easing, fill: 'forwards', pseudoElement: '::before' }
    );
  }

  private onSlotChange() {
    this.hasItems = this._itemSlots.length > 0;
    this.hasBody = this._bodySlots.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-search-view': MdSearchViewElement;
  }
}
