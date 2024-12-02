import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { MdFocusRingComponent } from '../../focus-ring/focus-ring.component';
import { MdEmbeddedButtonComponent } from '../../embedded-button/embedded-button.component';
import { MdRippleComponent } from '../../ripple/ripple.component';
import { CommonModule } from '@angular/common';
import { ButtonType } from '../../button/button.component';
import { MdMenuComponent } from '../menu.component';
import { MdIconComponent } from '../../icon/icon.component';
import { MdValueAccessorComponent } from '../../md-value-accessor.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { dispatchClosePopover } from '../../../common/events/dispatch-close-popover';

export type MenuItemType = ButtonType | 'checkbox' | 'radio';

@Component({
  selector: 'md-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdFocusRingComponent,
    MdEmbeddedButtonComponent,
    MdRippleComponent,
    CommonModule,
    MdMenuComponent,
    MdIconComponent,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdMenuItemComponent),
    },
  ],
  host: {
    '[class.disabled]': 'disabled()',
    '[class.selected]': 'selectedOrChecked()',
    '[class.show-check-icon]': 'showCheckIcon()',
    '(click)': 'click($event)',
  },
})
export class MdMenuItemComponent extends MdValueAccessorComponent<
  boolean | string
> {
  readonly type = input<MenuItemType>('button');
  readonly checked = model(false);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly shortcut = input<string>();
  readonly selected = input(false);
  readonly showCheckIcon = input(false);

  private readonly _parentMenu = inject(MdMenuComponent, {
    host: true,
    optional: true,
  });
  private readonly _menu = viewChild(MdMenuComponent);

  readonly selectedOrChecked = computed(
    () => this.selected() || this.checked()
  );

  constructor() {
    super();
    this._parentMenu?.open.subscribe((open) => {
      if (!open) {
        this._menu()?.open.set(false);
      }
    });
  }

  input(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.checked.set(!!input.checked);
  }

  private readonly _menuItems = contentChildren(MdMenuItemComponent);
  readonly hasChildMenuItems = computed(() => this._menuItems().length > 0);

  click(event: Event) {
    if (this.hasChildMenuItems()) {
      return;
    }

    event.stopPropagation();
    dispatchClosePopover(this.hostElement);
  }
}
