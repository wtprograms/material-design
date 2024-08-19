import { html, LitElement } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import { styles } from './styles';
import { EASING } from '../../common';
import { MdMenuItemElement } from '../menu-item';
import { MdDividerElement } from '../divider';
import { mixinAttachablePopover } from '../../common/mixins/mixin-attachable-popover';

const base = mixinAttachablePopover(LitElement);

@customElement('md-menu')
export class MdMenuElement extends base {
  static override styles = [styles];

  @queryAssignedElements({ flatten: true })
  private _slotElements!: HTMLElement[];

  get parentMenuItem(): MdMenuItemElement | undefined {
    return this.control instanceof MdMenuItemElement ? this.control : undefined;
  }

  override render(): unknown {
    return html`${this.renderPopover()}`;
  }

  override async showComponent(): Promise<void> {
    await super.showComponent();
    if (this.parentMenuItem) {
      this.parentMenuItem.open = true;
    }
  }

  override async onClosePopup(): Promise<void> {
    await super.onClosePopup();
  }

  override async close(): Promise<void> {
    await super.close();
    if (this.parentMenuItem) {
      this.parentMenuItem.open = false;
    }
  }

  override *getComponentAnimations(): Generator<Animation> {
    const superAnimations = super.getComponentAnimations();
    for (const animation of superAnimations) {
      yield animation;
    }

    let index = 0;
    const items = this.popoverContainer.style.transformOrigin.includes('top')
      ? this._slotElements.concat(...[])
      : this._slotElements.concat(...[]).reverse();
    for (const item of items) {
      index++;
      yield this.animateItem(
        item as MdMenuItemElement | MdDividerElement,
        index * 25
      );
    }
  }

  private animateItem(
    item: MdMenuItemElement | MdDividerElement,
    delay: number
  ) {
    const abs = this.popoverContainer.style.transformOrigin.includes('top')
      ? '-'
      : '';
    let opacity = ['0', '1'];
    let transform = [`translateY(${abs}24px)`, 'translateY(0)'];
    if (this.closing) {
      opacity = opacity.reverse();
      transform = transform.reverse();
      delay = 0;
    }

    const easing = this.opening
      ? EASING.standard.decelerate
      : EASING.standard.accelerate;
    const duration = this.opening ? 300 : 150;

    return item.animate(
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

  override attachControl(control: HTMLElement | null): void {
    super.attachControl(control);
    if (this.parentMenuItem) {
      setTimeout(() => {
        this.parentMenuItem!.subMenu = this;
        this.placement = 'right-start';
        this.offset = 0;
      }, 50);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-menu': MdMenuElement;
  }
}
