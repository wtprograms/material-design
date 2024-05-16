import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import style from './index.scss';

export type TypescaleScale = 'display' | 'headline' | 'body' | 'label' | 'title';
export type TypescaleSize = 'large' | 'medium' | 'small';

@customElement('md-typescale')
export class MdTypescaleElement extends LitElement {
  static override styles = [style];

  @property({ type: String, reflect: true})
  scale: TypescaleScale = 'body';

  @property({ type: String, reflect: true})
  size: TypescaleSize = 'medium';

  get typescale() {
    return ``;
  }

  override render() {
    return html`<slot></slot>`;
  }

  protected override update(changedProperties: Map<PropertyKey, unknown>) {
    super.update(changedProperties);
    if (changedProperties.has('size')) {
      const typescale = (property: string) => `var(--md-sys-typescale-${this.scale}-${this.size}-${property})`;
      if (this.size) {
        this.style.setProperty('--_font', typescale('font'));
        this.style.setProperty('--_weight', typescale('weight'));
        this.style.setProperty('--_size', typescale('size'));
      } else {
        this.style.setProperty('--_font', '');
        this.style.setProperty('--_weight', '');
        this.style.setProperty('--_size', '');
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-typescale': MdTypescaleElement;
  }
}
