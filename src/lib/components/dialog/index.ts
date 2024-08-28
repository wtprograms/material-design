import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';
import { MdElevationElement } from '../elevation';
import { DURATION, EASING, mixinDialog } from '../../common';

const base = mixinDialog(MdElevationElement);

@customElement('md-dialog')
export class MdDialogElement extends base {
  static override styles = [styles];

  protected override render(): unknown {
    return this.renderDialog();
  }

  override animateDialogElement(): Animation {
    let transform = ['translateY(-50px)', 'translateY(0)'];
    const easing = this.opening
      ? EASING.emphasized.decelerate
      : EASING.emphasized.accelerate;
    const duration = this.opening ? DURATION.long[1] : DURATION.short[3];
    if (this.closing) {
      transform = transform.reverse();
    }
    return this.dialog.animate(
      { transform },
      { duration, easing, fill: 'forwards' }
    );
  }

  override animateContainer(): Animation {
    let opacity = ['0', '1'];
    const easing = this.opening
      ? EASING.emphasized.decelerate
      : EASING.emphasized.accelerate;
    const duration = this.opening ? DURATION.long[1] : DURATION.short[3];
    if (this.closing) {
      opacity = opacity.reverse();
    }
    return this.container.animate(
      { opacity },
      { duration, easing, fill: 'forwards' }
    );
  }

  override animateContainerBefore(): Animation {
    let height = ['35%', '100%'];
    const easing = this.opening
      ? EASING.emphasized.decelerate
      : EASING.emphasized.accelerate;
    const duration = this.opening ? DURATION.long[4] : DURATION.short[3];
    if (this.closing) {
      height = height.reverse();
    }
    return this.container.animate(
      { height },
      { duration, easing, fill: 'forwards', pseudoElement: '::before' }
    );
  }

  override animateElevation(): Animation {
    let height = ['35%', '100%'];
    const easing = this.opening
      ? EASING.emphasized.decelerate
      : EASING.emphasized.accelerate;
    const duration = this.opening ? DURATION.long[4] : DURATION.short[3];
    if (this.closing) {
      height = height.reverse();
    }
    return this.elevation.animate(
      { height },
      { duration, easing, fill: 'forwards' }
    );
  }

  override animateHeadline(): Animation {
    let opacity = ['0', '1'];
    let transform = ['translateY(-50px)', 'translateY(0)'];
    const easing = this.opening
      ? EASING.emphasized.decelerate
      : EASING.emphasized.accelerate;
    const duration = this.opening ? DURATION.long[1] : DURATION.short[3];
    if (this.closing) {
      opacity = opacity.reverse();
      transform = transform.reverse();
    }
    return this.headline.animate(
      { opacity, transform },
      { duration, easing, fill: 'forwards' }
    );
  }

  override animateSupportingText(): Animation {
    let opacity = ['0', '1'];
    let transform = ['translateY(-50px)', 'translateY(0)'];
    const easing = this.opening
      ? EASING.emphasized.decelerate
      : EASING.emphasized.accelerate;
    const duration = this.opening ? DURATION.long[1] : DURATION.short[3];
    if (this.closing) {
      opacity = opacity.reverse();
      transform = transform.reverse();
    }
    return this.supportingText.animate(
      { opacity, transform },
      { duration, easing, fill: 'forwards' }
    );
  }

  override animateScroller(): Animation {
    let opacity = ['0', '1'];
    let transform = ['translateY(-50px)', 'translateY(0)'];
    const easing = this.opening
      ? EASING.emphasized.decelerate
      : EASING.emphasized.accelerate;
    const duration = this.opening ? DURATION.long[1] : DURATION.short[3];
    if (this.closing) {
      opacity = opacity.reverse();
      transform = transform.reverse();
    }
    return this.scroller.animate(
      { opacity, transform },
      { duration, easing, fill: 'forwards' }
    );
  }

  override animateActions(): Animation {
    let opacity = ['0', '1'];
    let transform = ['translateY(-50px)', 'translateY(0)'];
    const easing = this.opening
      ? EASING.emphasized.decelerate
      : EASING.emphasized.accelerate;
    const duration = this.opening ? DURATION.long[1] : DURATION.short[3];
    if (this.closing) {
      opacity = opacity.reverse();
      transform = transform.reverse();
    }
    return this.actions.animate(
      { opacity, transform },
      { duration, easing, fill: 'forwards' }
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-dialog': MdDialogElement;
  }
}
