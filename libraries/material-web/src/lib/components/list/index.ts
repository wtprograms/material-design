import { LitElement, html } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import style from './index.scss';
import { mixinActivatable } from '../../common';
import { MdListItemElement } from '../list-item';

const base = mixinActivatable(LitElement);

@customElement('md-list')
export class MdListElement extends base {
  static override styles = [style];

  @queryAssignedElements({ flatten: true })
  private readonly _slots!: HTMLElement[];

  get items(): MdListItemElement[] {
    return this._slots.filter(
      (el) => el instanceof MdListItemElement
    ) as MdListItemElement[];
  }

  protected override update(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.update(changedProperties);
    if (changedProperties.has('activatable')) {
      this.updateActivatable();
    }
  }

  override render() {
    return html`<slot></slot>`;
  }

  private updateActivatable() {
    for (const item of this.items) {
      item.activatable = this.activatable;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-list': MdListElement;
  }
}
