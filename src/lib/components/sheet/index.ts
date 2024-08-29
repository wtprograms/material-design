import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { DURATION, EASING, mixinDialog } from '../../common';

export type SheetDock = 'top' | 'end' | 'bottom' | 'start';

const base = mixinDialog(LitElement);

@customElement('md-sheet')
export class MdSheetElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  dock: SheetDock = 'start';

  @property({ type: Boolean, reflect: true })
  navigation = false;

  protected override render(): unknown {
    return this.renderDialog();
  }

  override animateContainer(): Animation {
    const func =
      this.dock === 'top' || this.dock === 'bottom'
        ? 'translateY'
        : 'translateX';
    const abs = this.dock === 'start' || this.dock === 'top' ? '-' : '';

    let transform = [`${func}(${abs}100%)`, `${func}(0)`];
    let opacity = ['0', '1'];
    const easing = this.opening
      ? EASING.emphasized.decelerate
      : EASING.emphasized.accelerate;
    const duration = this.opening ? DURATION.long[1] : DURATION.short[3];
    if (this.closing) {
      opacity = opacity.reverse();
      transform = transform.reverse();
    }
    return this.container.animate(
      { opacity, transform },
      { duration, easing, fill: 'forwards' }
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-sheet': MdSheetElement;
  }
}
