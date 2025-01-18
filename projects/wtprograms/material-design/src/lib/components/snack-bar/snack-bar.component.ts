import { isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
  model,
} from '@angular/core';
import { MdComponent } from '../../common/base/md.component';
import { DURATION } from '../../common/motion';
import { MdButtonComponent } from '../button/button.component';
import { MdIconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'md-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdIconButtonComponent],
  host: {
    '[attr.multiline]': 'multiline() ? "" : null',
    '(touchstart)': 'touchStart($event)',
    '(touchmove)': 'touchMove($event)',
    '(touchend)': 'touchEnd($event)',
  },
})
export class MdSnackBarComponent extends MdComponent {
  readonly open = model(false);
  readonly multiline = input(false);
  readonly closable = input(false);
  private readonly _actions = contentChildren(MdButtonComponent);
  private startX = 0;
  private currentX = 0;
  private translateX = 0;

  constructor() {
    super();
    this.hostElement.popover = 'manual';
    effect(() => {
      const actions = this._actions();
      for (const action of actions) {
        action.hostElement.addEventListener('click', () => this.open.set(false));
        action.variant.set('text');
      }
    });
    effect(() => {
      const open = this.open();
      if (isPlatformServer(this.platformId)) {
        return;
      }
      if (open) {
        this.hostElement.showPopover();
      } else {
        this.hostElement.hidePopover();
      }
    });
  }

  closeClick() {
    this.open.set(false);
  }

  touchStart(event: TouchEvent) {
    const element = event.target as HTMLElement;
    if (element.tagName === 'BUTTON') {
      return;
    }
    event.preventDefault();
    this.startX = event.touches[0].clientX;
  }

  touchMove(event: TouchEvent) {
    const element = event.target as HTMLElement;
    if (element.tagName === 'BUTTON') {
      return;
    }
    this.currentX = event.touches[0].clientX;
    this.translateX = this.currentX - this.startX;
    this.hostElement.style.transition = 'none';
    this.hostElement.style.transform = `translateX(${this.translateX}px)`;
  }

  touchEnd(event: TouchEvent) {
    const element = event.target as HTMLElement;
    if (element.tagName === 'BUTTON') {
      return;
    }
    const percentage = Math.abs(this.translateX) / this.hostElement.offsetWidth;
    if (percentage > 0.35 && this.startX !== 0) {
      const direction = this.translateX < 0 ? '-300%' : '300%';
      this.hostElement.style.transition = '';
      this.hostElement.style.transform = `translateX(${direction})`;
      setTimeout(() => {
        this.hostElement.style.transform = '';
        this.startX = 0;
        this.currentX = 0;
        this.translateX = 0;
        this.open.set(false);
      }, DURATION.short4);
    } else {
      this.hostElement.style.transition = '';
      this.hostElement.style.transform = '';
    }
  }
}
