import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  model,
  contentChildren,
  viewChild,
  forwardRef,
  effect,
} from '@angular/core';
import { MdMenuComponent } from '../menu.component';
import { MenuItemType } from './menu-item-type';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdBadgeComponent } from '../../badge/badge.component';
import { MdEmbeddedBadgeDirective } from '../../badge/embedded-badge.directive';
import { MdEmbeddedButtonComponent } from '../../embedded-button/embedded-button.component';
import { MdFocusRingComponent } from '../../focus-ring/focus-ring.component';
import { MdIconComponent } from '../../icon/icon.component';
import { MdRippleComponent } from '../../ripple/ripple.component';
import { MdTintComponent } from '../../tint/tint.component';
import { MdValueAccessorComponent } from '../../../common/base/value-accessor/md-value-accessor.component';
import { dispatchClosePopover } from '../../../common/events/dispatch-close-popover';

@Component({
  selector: 'md-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdEmbeddedButtonComponent,
    CommonModule,
    MdBadgeComponent,
    MdFocusRingComponent,
    MdTintComponent,
    MdRippleComponent,
    MdMenuComponent,
    MdIconComponent,
  ],
  hostDirectives: [
    {
      directive: MdEmbeddedBadgeDirective,
      inputs: ['dot: badgeDot', 'text: badgeText'],
    },
  ],
  host: {
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.selected]': 'selected() ? "" : null',
    '[attr.type]': 'type()',
    '(click)': 'click($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdMenuItemComponent),
    },
  ],
})
export class MdMenuItemComponent extends MdValueAccessorComponent<
  string | boolean | number
> {
  readonly embeddedBadge = inject(MdEmbeddedBadgeDirective);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly subItems = contentChildren(MdMenuItemComponent);
  readonly selected = model(false);
  readonly subMenu = viewChild(MdMenuComponent);
  readonly type = input<MenuItemType>('button');
  readonly useCheckIcon = input(false);
  readonly radioValue = input<string | boolean | number>();
  readonly blankIcon = input(false);

  constructor() {
    super();
    effect(() => {
      const type = this.type();
      const value = this.value();
      const radioValue = this.radioValue();
      const selected = this.selected();
      if (type === 'radio') {
        this.selected.set(value === radioValue);
      } else if (type === 'checkbox') {
        this.value.set(selected);
      }
    });
  }

  click(event: Event) {
    if (this.subItems().length === 0) {
      dispatchClosePopover(this.hostElement, event);
    }
  }

  openChange(open: boolean) {
    if (open) {
      return;
    }
    const subItems = this.subItems();
    for (const subItem of subItems) {
      subItem.subMenu()?.open.set(false);
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.type() === 'radio') {
      this.value.set(this.radioValue());
    } else {
      this.selected.set(input.checked);
    }
  }
}
