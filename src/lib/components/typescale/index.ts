import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';

export type Typescale = 'display' | 'headline' | 'title' | 'label' | 'body';

export type TypescaleSize = 'large' | 'medium' | 'small';

@customElement('md-typescale')
export class MdTypescaleElement extends LitElement {
  static override styles = [styles];

  @property({ type: String })
  scale: Typescale = 'body';

  @property({ type: String })
  size: TypescaleSize = 'medium';

  @property({ type: Boolean, reflect: true })
  responsive = false;

  protected override update(changedProperties: PropertyValues): void {
    if (this.responsive) {
      this.style.fontFamily = '';
      this.style.fontWeight = '';
      this.style.fontSize = '';
    } else if (
      changedProperties.has('scale') ||
      changedProperties.has('size')
    ) {
      const typescale = this.scale + '-' + this.size;
      this.style.fontFamily = `var(--md-sys-typescale-${typescale}-font)`;
      this.style.fontWeight = `var(--md-sys-typescale-${typescale}-weight)`;
      this.style.fontSize = `var(--md-sys-typescale-${typescale}-size)`;
    }
    super.update(changedProperties);
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-typescale': MdTypescaleElement;
  }
}
