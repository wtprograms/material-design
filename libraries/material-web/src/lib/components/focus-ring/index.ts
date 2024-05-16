import { customElement, property } from 'lit/decorators.js';
import style from './index.scss';
import { mixinAttachable } from '../../common';
import { LitElement, PropertyValues } from 'lit';
import { MdElevationElement } from '../elevation';

const base = mixinAttachable(LitElement);

@customElement('md-focus-ring')
export class MdFocusRingElement extends base {
  static override styles = [style];

  @property({ type: Boolean, reflect: true, attribute: 'focus-visible' })
  focusVisible = false;

  @property({ type: Number, reflect: true })
  size?: number;

  @property({ type: Boolean, reflect: true })
  focused = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  constructor() {
    super();
    this.initialize('focusin', 'focusout');
  }

  protected override update(changedProps: PropertyValues<MdElevationElement>) {
    if (changedProps.has('disabled') && this.disabled) {
      this.focused = false;
    }
    super.update(changedProps);
  }

  override async handleControlEvent(event: Event) {
    const handlers: Record<string, () => void> = {
      focusin: () => {
        if (this.disabled) {
          return;
        }
        return (this.focused = this.focusVisible
          ? this.control?.matches(':focus-visible') ?? false
          : true);
      },
      focusout: () => (this.focused = false),
    };
    handlers[event.type]();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-focus-ring': MdFocusRingElement;
  }
}
