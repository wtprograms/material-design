import { html, PropertyValues } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import { styles } from './styles';
import { EASING, ObservableElement } from '../../common';
import { mixinPopover } from '../../common/mixins/mixin-popover';
import { MdFabElement } from '../fab';
import { Placement } from '@floating-ui/dom';

const base = mixinPopover(ObservableElement);

@customElement('md-fab-actions')
export class MdFabActionsElement extends base {
  static override styles = [styles];

  @queryAssignedElements({ slot: '', flatten: true})
  private _actions!: MdFabElement[];

  constructor() {
    super();
    this.placement = 'top';
    this.strategy = 'absolute';
    this.offset = 8;
    this.initialize('click');
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.updateActions();
  }

  override render() {
    return html`<slot @click=${this.closeComponent} @slotchange=${this.updateActions}></slot>`;
  }

  override *getPopoverAnimations(opening: boolean) {
    let delay = -50;
    const items = opening
      ? this._actions.slice().reverse()
      : this._actions;
    for (const action of items) {
      yield () => {
        delay += 50;
        return this.animateAction(action, delay, opening);
      };
    }
  }

  private animateAction(action: HTMLElement, delay: number, opening: boolean) {
    let opacity = ['0', '1'];
    let transform = ['translateY(50%)', 'translateY(0)'];
    if (!opening) {
      opacity = opacity.reverse();
      transform = transform.reverse();
    }

    const easing = opening
      ? EASING.standard.decelerate
      : EASING.standard.accelerate;
    const duration = opening ? 300 : 50;

    return action.animate(
      {
        opacity,
        transform,
      },
      {
        delay,
        easing,
        duration,
        fill: 'forwards',
      }
    );
  }

  private updateActions() {
    for (const action of this._actions) {
      action.size = 'small';
      action.palette = 'secondary';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-fab-actions': MdFabActionsElement;
  }
}
