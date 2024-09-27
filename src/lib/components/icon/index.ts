import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { Observable } from 'rxjs';
import { cssProperty, ObservableElement } from '../../common';
import { mixinBadge } from '../../common/mixins/mixin-badge';

const base = mixinBadge(ObservableElement);

@customElement('md-icon')
export class MdIconElement extends base {
  static override styles = [styles];

  @property({ type: Boolean })
  filled = false;

  @property({ type: Number })
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
