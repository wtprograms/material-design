import { LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import {
  map,
} from 'rxjs';
import { attribute, mixinAttachable, ObservableElement } from '../../common';

const base = mixinAttachable(ObservableElement);

@customElement('md-focus-ring')
export class MdFocusRingElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, attribute: 'focus-visible' })
  focusVisible = false;

  constructor() {
    super();
    this.initialize('focusin', 'focusout');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.event$
      .pipe(
        map((event) => {
          if (event.type === 'focusout') {
            return false;
          }
          return this.focusVisible
            ? this.control?.matches(':focus-visible') ?? false
            : true;
        }),
        attribute(this, 'focused')
      )
      .subscribe();
  }

  override render() {
    return nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-focus-ring': MdFocusRingElement;
  }
}
