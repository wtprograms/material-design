import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { classMap } from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

export type ProgressIndicatorVariant = 'circular' | 'linear';

@customElement('md-progress-indicator')
export class MdProgressIndicatorElement extends LitElement {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  variant: ProgressIndicatorVariant = 'circular';

  @property({ type: Number })
  value = 0;

  @property({ type: Number })
  max = 1;

  @property({ type: Boolean })
  indeterminate = false;

  @property({ type: Boolean, attribute: 'four-color' })
  fourColor = false;

  @property({ type: Number })
  buffer = 0;

  @property({ type: Number, reflect: true })
  get size(): number | null {
    return this._size;
  }
  set size(value: number | null) {
    this._size = value;
    this.updateSize();
  }
  private _size: number | null = null;

  protected override render() {
    const body =
      this.variant === 'circular' ? this.renderCircular() : this.renderLinear();
    return html`
      <div
        class="progress ${classMap(this.getRenderClasses())}"
        role="progressbar"
      >
        ${body}
      </div>
    `;
  }

  private renderCircular() {
    if (this.indeterminate) {
      return this.renderIndeterminateContainer();
    }

    return this.renderDeterminateContainer();
  }

  // Determinate mode is rendered with an svg so the progress arc can be
  // easily animated via stroke-dashoffset.
  private renderDeterminateContainer() {
    const dashOffset = (1 - this.value / this.max) * 100;
    // note, dash-array/offset are relative to Setting `pathLength` but
    // Chrome seems to render this inaccurately and using a large viewbox helps.
    return html`
      <svg viewBox="0 0 4800 4800">
        <circle class="track" pathLength="100"></circle>
        <circle
          class="active-track"
          pathLength="100"
          stroke-dashoffset=${dashOffset}
        ></circle>
      </svg>
    `;
  }

  // Indeterminate mode rendered with 2 bordered-divs. The borders are
  // clipped into half circles by their containers. The divs are then carefully
  // animated to produce changes to the spinner arc size.
  // This approach has 4.5x the FPS of rendering via svg on Chrome 111.
  // See https://lit.dev/playground/#gist=febb773565272f75408ab06a0eb49746.
  private renderIndeterminateContainer() {
    return html` <div class="spinner">
      <div class="left">
        <div class="circle"></div>
      </div>
      <div class="right">
        <div class="circle"></div>
      </div>
    </div>`;
  }

  private renderLinear() {
    const progressStyles = {
      transform: `scaleX(${
        (this.indeterminate ? 1 : this.value / this.max) * 100
      }%)`,
    };

    const bufferValue = this.buffer ?? 0;
    const hasBuffer = bufferValue > 0;

    const dotSize =
      this.indeterminate || !hasBuffer ? 1 : bufferValue / this.max;

    const dotStyles = {
      transform: `scaleX(${dotSize * 100}%)`,
    };

    // Only display dots when visible - this prevents invisible infinite
    // animation.
    const hideDots =
      this.indeterminate ||
      !hasBuffer ||
      bufferValue >= this.max ||
      this.value >= this.max;
    return html`
      <div class="dots" ?hidden=${hideDots}></div>
      <div class="inactive-track" style=${styleMap(dotStyles)}></div>
      <div class="bar primary-bar" style=${styleMap(progressStyles)}>
        <div class="bar-inner"></div>
      </div>
      <div class="bar secondary-bar">
        <div class="bar-inner"></div>
      </div>
    `;
  }

  protected getRenderClasses() {
    return {
      indeterminate: this.indeterminate,
      'four-color': this.fourColor,
    };
  }

  override connectedCallback() {
    super.connectedCallback();
    this.updateSize();
  }

  private updateSize() {
    if (this._size !== null) {
      this.style.setProperty('--_size', `${this._size}px`);
    } else {
      this.style.removeProperty('--_size');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-progress-indicator': MdProgressIndicatorElement;
  }
}
