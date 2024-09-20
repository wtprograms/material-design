import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { Observable } from 'rxjs';
import { property$ } from '../../common/lit/property$.decorator';
import { cssProperty } from '../../common';
import { ifDefined } from 'lit/directives/if-defined.js';
import { mixinBadge } from '../../common/mixins/mixin-badge';

const base = mixinBadge(LitElement);

@customElement('md-icon')
export class MdIconElement extends base {
  static override styles = [styles];

  @property({ type: Boolean })
  filled = false;

  @property({ type: Number })
  @property$()
  size: number | null = null;
  size$!: Observable<number | null>;

  override connectedCallback(): void {
    super.connectedCallback();
    this.size$.pipe(
      cssProperty(this, '--md-comp-icon-size')
    ).subscribe();
  }

  override render() {
    return html`<slot></slot>${this.renderBadge()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-icon': MdIconElement;
  }
}
