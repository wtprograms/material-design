import { html, LitElement, nothing } from 'lit';
import { MixinBase, MixinReturn } from './mixin';
import { Field, mixinField } from './mixin-field';
import { query, queryAssignedElements, property } from 'lit/decorators.js';
import { MdPopupElement } from '../../components';

export interface Dropdown extends Field {
  popup: MdPopupElement;
  renderPopupContent(): unknown;
}

export function mixinDropdown<T extends MixinBase<LitElement>>(
  base: T
): MixinReturn<T, Dropdown> {
  const _base = mixinField(base);
  abstract class Mixin extends _base implements Dropdown {
    @query('md-popup')
    popup!: MdPopupElement;
  
    @property({ type: Boolean, reflect: true, attribute: 'has-selected' })
    hasSelected = false;
  
    @queryAssignedElements({ slot: 'selected', flatten: true })
    private readonly _selectedSlots!: HTMLElement[];
  
    override render(): unknown {
      return html`${this.renderBody()}${this.renderFooter()}`;
    }
  
    override renderBody(): unknown {
      const ripple =
        this.variant === 'filled'
          ? html`<md-ripple for="body" hoverable></md-ripple>`
          : nothing;
      return html` <span class="label">${this.label}</span>
        <span class="small-label">${this.label}</span>
        <div id="body" class="body" @click=${this.onBodyClick}>
          ${ripple}
          <div class="container"></div>
          <div class="container-top border-before"></div>
          <div class="container-top border-after"></div>
          ${this.renderLeading()} ${this.renderControl()} ${this.renderTrailing()}
          <button
            id="button"
            @blur=${this.onInputBlur}
            @click=${this.onButtonClick}
          ></button>
          <md-popup
            for="button"
            @opening=${this.opening}
            @closing=${this.closing}
          >
            <slot name="popup"></slot>
            ${this.renderPopupContent()}
          </md-popup>
        </div>`;
    }

    renderPopupContent(): unknown {
      return nothing;
    }
  
    private opening(): void {
      this.populated = true;
    }
  
    private closing(): void {
      this.populated = !!this.value;
    }
  
    override renderTrailing(): unknown {
      return html`<div class="trailing">
        <md-icon>arrow_drop_down</md-icon>
      </div>`;
    }
  
    override renderInput(): unknown {
      const value = !this.hasSelected
        ? html`<span>${this.value}</span>`
        : nothing;
      return html`<slot
          name="selected"
          @slotchange=${this.onSelectedSlotChange}
        ></slot
        >${value}`;
    }
  
    private onSelectedSlotChange(): void {
      this.hasSelected = this._selectedSlots.length > 0;
    }
  
    private onInputBlur(): void {
      this.populated = !!this.value;
    }
  
    override onControlClick(): void {
    }
  
    private onButtonClick(): void {
      this.popup.showComponent();
    }
  
    private onBodyClick() {
      this.popup.showComponent();
    }
  }

  return Mixin;
}
