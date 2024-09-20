import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { mixinBusyButton } from '../../common/mixins/mixin-busy-button';
import { ifDefined } from 'lit/directives/if-defined.js';
import { mixinParentActivation } from '../../common/mixins/mixin-parent-activation';
import { mixinSelected } from '../../common/mixins/mixin-selected';
import { mixinBadge } from '../../common/mixins/mixin-badge';
import { FormSubmitter, mixinElementInternals, setupFormSubmitter } from '../../common';

export type IconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard';

const base = mixinElementInternals(mixinBusyButton(
  mixinParentActivation(mixinSelected(mixinBadge(LitElement)))
));

@customElement('md-icon-button')
export class MdIconButtonElement extends base implements FormSubmitter {
  static override styles = [styles];

  static {
    setupFormSubmitter(MdIconButtonElement);
  }

  static readonly formAssociated = true;

  @property({ type: String, reflect: true })
  variant: IconButtonVariant = 'standard';

  @property({ type: Boolean, reflect: true })
  custom = false;

  protected override render(): unknown {
    return html`${this.renderAttachables()}
    ${this.renderAnchorOrButton(this.renderContent())}
    ${this.renderProgressIndicator()}`;
  }

  private renderContent() {
    return this.custom
      ? html`<slot></slot>`
      : html`<md-icon
          ?badge-dot=${this.badgeDot}
          badge-number=${ifDefined(this.badgeNumber)}
          ?filled=${this.selected}
          ><slot></slot
        ></md-icon>`;
  }

  private renderAttachables() {
    return html` <md-focus-ring for="control" focus-visible></md-focus-ring>
      <md-ripple for="control" interactive></md-ripple>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-icon-button': MdIconButtonElement;
  }
}
