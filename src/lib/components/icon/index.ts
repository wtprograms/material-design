import '../badge';
import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { Observable } from 'rxjs';
import { property$ } from '../../common/lit/property$.decorator';
import { cssProperty } from '../../common';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('md-icon')
export class MdIconElement extends LitElement {
  static override styles = [styles];

  @property({ type: Boolean })
  filled = false;

  @property({ type: Number })
  @property$()
  size: number | null = null;
  size$!: Observable<number | null>;

  @property({ type: Boolean, attribute: 'badge-dot' })
  badgeDot = false;

  @property({ type: Number, attribute: 'badge-number' })
  badgeNumber: number | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.size$.pipe(
      cssProperty(this, '--md-comp-icon-size')
    ).subscribe();
  }

  override render() {
    const badge = this.badgeDot || this.badgeNumber !== null
      ? html`<md-badge ?dot=${this.badgeDot} number=${ifDefined(this.badgeNumber)}></md-badge>`
      : nothing;
    return html`<slot></slot>${badge}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-icon': MdIconElement;
  }
}
