import { LitElement, html } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { awaitAnimation, mixinButton } from '../../common';

export type FabPalette = 'surface' | 'primary' | 'secondary' | 'tertiary';

export type FabSize = 'large' | 'medium' | 'small';

const base = mixinButton(LitElement);

@customElement('md-fab')
export class MdFabElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  palette: FabPalette = 'primary';

  @property({ type: String, reflect: true })
  size: FabSize = 'medium';

  @property({ type: Boolean, reflect: true })
  get extended(): boolean {
    return this._extended;
  }
  set extended(value: boolean) {
    if (value) {
      this.openLabel();
    } else {
      this.closeLabel();
    }
  }
  private _extended = true;

  @property({ type: Boolean, reflect: true })
  lowered = false;

  @property({ type: Boolean, reflect: true, attribute: 'has-icon' })
  hasIcon = false;

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly _iconSlotElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'has-label' })
  hasLabel = false;

  @queryAssignedElements({ slot: 'label', flatten: true })
  private readonly _labelSlotElements!: HTMLElement[];

  @query('.label')
  private readonly _labelElement?: HTMLSpanElement;

  private _labelAnimation?: Animation;

  async openLabel() {
    if (!this._labelElement) {
      return;
    }
    this._labelElement.style.display = 'inline';
    this._labelElement.style.width = 'auto';
    await this.animateLabel(true);
    this._extended = true;
  }

  async closeLabel() {
    if (!this._labelElement) {
      return;
    }
    await this.animateLabel(false);
    this._extended = false;
    this._labelElement.style.display = 'none';
  }

  private async animateLabel(open: boolean) {
    this._labelAnimation?.cancel();
    let opacity = ['0', '1'];
    let width = [0 + '', this._labelElement?.offsetWidth + 'px'];
    if (!open) {
      opacity = opacity.reverse();
      width = width.reverse();
    }

    this._labelAnimation = this._labelElement?.animate(
      {
        opacity,
        width,
      },
      {
        duration: 200,
        easing: 'ease-in-out',
        fill: 'forwards',
      }
    );

    await awaitAnimation(this._labelAnimation);
  }

  protected override render(): unknown {
    const level = this.lowered ? 1 : 3;
    return html`
      <md-elevation
        for=${this.targetId}
        level=${level}
        activatable
        ?disabled=${this.disabled}
      ></md-elevation>
      <md-ripple
        for=${this.targetId}
        activatable
        ?disabled=${this.disabled}
      ></md-ripple>
      <md-focus-ring
        for=${this.targetId}
        focus-visible
        ?disabled=${this.disabled}
      ></md-focus-ring>
      ${this.renderAnchorOrButton()}`;
  }

  override renderContent() {
    return html`<span class="icon">
        <slot name="icon" @slotchange=${this.onIconSlotChange}></slot>
      </span>
      <span class="label">
        <slot name="label" @slotchange=${this.onIconSlotChange}></slot>
      </span>`;
  }

  private onIconSlotChange() {
    this.hasIcon = this._iconSlotElements.length > 0;
    this.hasLabel = this._labelSlotElements.length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-fab': MdFabElement;
  }
}
