import { LitElement, TemplateResult, html } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { DURATION, EASING, InvalidOperationError, mixinButton, sleep } from '../../common';
import { FabPalette } from './fab-palette';
import style from './index.scss';
import { FabSize } from './fab-size';

const base = mixinButton(LitElement);

@customElement('md-fab')
export class MdFabElement extends base {
  static override styles = [style];

  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  @property({ type: String, reflect: true })
  palette: FabPalette = 'primary';

  @property({ type: String, reflect: true })
  size: FabSize = 'medium';

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly _iconSlots!: HTMLElement[];

  @property({ type: Boolean, attribute: 'has-icon', reflect: true })
  hasIcon = false;

  @property({ type: Boolean, reflect: true })
  lowered = false;

  @property({ type: Boolean, noAccessor: true})
  get extended() {
    return this.getAttribute('extended') !== null;
  }
  set extended(value: boolean) {
    if (!value && !this.hasIcon) {
      throw new InvalidOperationError(
        'Cannot set `extended` to `false` when there is no icon.'
      );
    }

    if (value) {
      this.showLabel();
      this.setAttribute('extended', '');
    } else {
      this.hideLabel();
      this.removeAttribute('extended');
    }
  }

  @queryAssignedElements({ slot: 'label', flatten: true })
  private readonly _labelSlots!: HTMLElement[];

  @property({ type: Boolean, attribute: 'has-label', reflect: true })
  hasLabel = false;

  @query('.label')
  private _labelElement?: HTMLElement;

  override render() {
    return html`
      <div class="container"></div>
      <md-elevation
        for="button"
        level=${this.lowered ? 1 : 3}
        hoverable
        activatable
        ?disabled=${this.disabled}
      ></md-elevation>
      <md-focus-ring
        for="button"
        focus-visible
        ?disabled=${this.disabled}
      ></md-focus-ring>
      <md-ripple for="button" hoverable activatable ?disabled=${this.disabled}>
      </md-ripple>
      ${this.renderAnchorOrButton()}
    `;
  }

  override renderContent(): TemplateResult {
    return html`<slot
        name="icon"
        @slotchange=${this.onSlotChange}
        ?hidden=${!this.hasIcon}
      ></slot>
      <span class="label" ?hidden=${!this.hasLabel}>
        <slot name="label" @slotchange=${this.onSlotChange}></slot>
      </span> `;
  }

  private onSlotChange() {
    this.hasIcon = this._iconSlots.length > 0;
    this.hasLabel = this._labelSlots.length > 0;
  }

  private _labelAnimation?: Animation;
  private async showLabel() {
    if (!this._labelElement || this.extended) {
      return;
    }
    this._labelAnimation?.cancel();

    this._labelElement.style.opacity = '0';
    this._labelElement.style.position = 'absolute';
    this._labelElement.style.width = 'auto';
    const width = this._labelElement.offsetWidth;
    this._labelElement.style.position = '';
    this._labelElement.style.width = '0px';
    this._labelElement.style.opacity = '';

    const marginLeft = this.hasIcon
      ? ['0px', '8px']
      : [];

    this._labelAnimation = this._labelElement.animate(
      {
        width: ['0px', `${width}px`],
        marginLeft
      },
      {
        duration: DURATION.short[4],
        easing: EASING.standard.decelerate,
        fill: 'forwards',
      }
    );
  }

  private async hideLabel() {
    if (!this._labelElement || !this.extended) {
      return;
    }
    this._labelAnimation?.cancel();

    this._labelElement.style.opacity = '0';
    this._labelElement.style.position = 'absolute';
    this._labelElement.style.width = 'auto';
    const width = this._labelElement.offsetWidth;
    this._labelElement.style.position = '';
    this._labelElement.style.width = '0px';
    this._labelElement.style.opacity = '';

    const marginLeft = this.hasIcon
      ? ['8px', '0px']
      : [];

    this._labelAnimation = this._labelElement.animate(
      {
        width: [`${width}px`, '0px'],
        marginLeft
      },
      {
        duration: DURATION.short[4],
        easing: EASING.standard.accelerate,
        fill: 'forwards',
      }
    );

  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-fab': MdFabElement;
  }
}
