import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { MdTabElement } from '../tab';
import { DURATION, EASING } from '../../common';

@customElement('md-tabs')
export class MdTabsElement extends LitElement {
  static override styles = [styles];

  @queryAssignedElements({ flatten: true })
  private readonly _tabs!: MdTabElement[];

  @property({ type: Boolean, reflect: true })
  secondary = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-indicator' })
  hasIndicator = false;

  @query('.indicator')
  private readonly _indicator!: HTMLElement;

  override render() {
    return html`<div class="items">
        <slot
          @slotchange=${this.onSlotChange}
          @selected-change=${this.onSelectChange}
        ></slot>
      </div>
      <div class="indicator"></div>`;
  }

  private onSlotChange() {
    for (const tabItem of this._tabs) {
      tabItem.secondary = this.secondary;
    }
  }

  private onSelectChange(event: Event) {
    const tab = event.target as MdTabElement;
    if (!tab.selected) {
      this.hasIndicator = false;
      return;
    }
    for (const tabItem of this._tabs) {
      if (tab === tabItem) {
        continue;
      }
      tabItem.selected = false;
    }
    this.hasIndicator = true;
    this.adjustIndicator(tab);
  }

  private adjustIndicator(tab: MdTabElement) {
    if (this.secondary) {
      this._indicator.style.marginLeft = `${tab.offsetLeft}px`;
      this._indicator.style.width = `${tab.offsetWidth}px`;
      return;
    }
    const width = `max(calc(${tab.text.offsetWidth}px / 2), 24px)`;
    const offsetRight = `calc(${tab.offsetLeft}px + ${tab.offsetWidth}px)`;
    this._indicator.style.marginLeft = `calc(${offsetRight} - ${tab.offsetWidth}px / 2 - ${width} / 2)`;
    this._indicator.style.width = width;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-tabs': MdTabsElement;
  }
}
