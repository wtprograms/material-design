import { LitElement, html } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import style from './index.scss';
import { MdSegementedButtonElement } from '../segmented-button';

@customElement('md-segmented-button-set')
export class MdSegmentedButtonSetElement extends LitElement {
  static override styles = [style];

  @queryAssignedElements({ flatten: true })
  private readonly _slots!: HTMLElement[];

  @property({ type: Boolean, reflect: true })
  full = false;

  get items(): MdSegementedButtonElement[] {
    return this._slots.filter(
      (el) => el instanceof MdSegementedButtonElement
    ) as MdSegementedButtonElement[];
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-segmented-button-set': MdSegmentedButtonSetElement;
  }
}
