import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { LitElement, nothing, PropertyValues } from 'lit';
import {
  mixinAttachable,
  mixinDisabled,
} from '../../common';

const base = mixinDisabled(
  mixinAttachable(LitElement)
);

@customElement('md-focus-ring')
export class MdFocusRingElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true, attribute: 'focus-visible' })
  focusVisible = false;

  @property({ type: Boolean, reflect: true, attribute: 'is-focused' })
  isFocused = false;

  constructor() {
    super();
    this.initialize('focusin', 'focusout');
  }

  protected override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('disabled') && this.disabled) {
      this.isFocused = false;
    }
    super.updated(changedProperties);
  }

  protected override render(): unknown {
    return nothing;
  }

  override async handleControlEvent(event: Event): Promise<void> {
    if (this.disabled) {
      return;
    }

    if (event.type === 'focusin') {
      if (this.focusVisible) {
        this.isFocused = this.control?.matches(':focus-visible') ?? false;
      } else {
        this.isFocused = true;
      }
    }
    if (event.type === 'focusout') {
      this.isFocused = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-focus-ring': MdFocusRingElement;
  }
}
