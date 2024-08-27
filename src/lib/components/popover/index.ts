import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styles } from './styles';
import { mixinAttachablePopover } from '../../common';

const base = mixinAttachablePopover(LitElement, {
  trigger: 'manual',
});

@customElement('md-popover')
export class MdPopoverElement extends base {
  static override styles = [styles];

  override render(): unknown {
    return html`${this.renderPopover()}`;
  }

  override renderFooter(): unknown {
    return html`<slot name="footer"></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-popover': MdPopoverElement;
  }
}
