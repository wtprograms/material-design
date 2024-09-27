import { html, nothing, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styles } from './styles';
import { cssProperty, EASING, ObservableElement, observe } from '../../common';
import { mixinPopover } from '../../common/mixins/mixin-popover';

const base = mixinPopover(ObservableElement);

@customElement('md-popover')
export class MdPopoverElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, attribute: 'no-elevation' })
  noElevation = false;

  @property({ type: Boolean, attribute: 'stop-close-propegation' })
  stopClosePropegation = false;

  @query('.container')
  private _container!: HTMLElement;

  @query('.body')
  private _body!: HTMLElement;

  override render() {
    const elevation = this.noElevation
      ? nothing
      : html`<md-elevation level="2"></md-elevation>`;
    return html`<div part="container" class="container">${elevation}</div>
      <div part="body" class="body">
        <slot @close-popover=${this.handleClosePopover}></slot>
      </div>`;
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.transformOrigin$
      .pipe(cssProperty(this._container, 'transform-origin'))
      .subscribe();
  }

  private handleClosePopover(event: Event) {
    if (this.stopClosePropegation) {
      event.stopPropagation();
    }
    this.closeComponent();
  }

  override *getPopoverAnimations(opening: boolean) {
    yield () => this.animateContainer(opening);
    yield () => this.animateBody(opening);
  }

  private animateBody(opening: boolean) {
    let opacity = ['0', '1'];
    let delay = 200;
    if (!opening) {
      delay = 0;
      opacity = opacity.reverse();
    }

    const easing = opening
      ? EASING.standard.decelerate
      : EASING.standard.accelerate;
    const duration = opening ? 300 : 50;

    return this._body.animate(
      {
        opacity,
      },
      {
        delay,
        easing,
        duration,
        fill: 'forwards',
      }
    );
  }

  private animateContainer(opening: boolean) {
    let transform = ['scaleY(30%)', 'scaleY(100%)'];
    let delay = 0;
    let opacity = ['0', '1'];
    if (!opening) {
      delay = 50;
      transform = transform.reverse();
      opacity = opacity.reverse();
    }

    const easing = opening
      ? EASING.standard.decelerate
      : EASING.standard.accelerate;
    const duration = opening ? 300 : 150;

    return this._container.animate(
      {
        transform,
        opacity,
      },
      {
        delay,
        easing,
        duration,
        fill: 'forwards',
      }
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-popover': MdPopoverElement;
  }
}
