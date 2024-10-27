import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  model,
  viewChild,
  ElementRef,
  computed,
  HostListener,
} from '@angular/core';
import { textDirection } from '../../common/rxjs/text-direction';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { IconComponent } from '../icon/icon.component';
import { MaterialDesignComponent } from '../material-design.component';
import { MenuComponent } from '../menu/menu.component';
import { RippleComponent } from '../ripple/ripple.component';
import { TouchAreaComponent } from '../touch-area/touch-area.component';
import { SlotDirective } from '../../directives/slot.directive';

@Component({
  selector: 'md-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    FocusRingComponent,
    RippleComponent,
    TouchAreaComponent,
    MenuComponent,
    IconComponent,
    CommonModule,
    SlotDirective,
  ],
  hostDirectives: [],
  host: {
    '[attr.leading]': 'leadingSlot()?.any() || null',
    '[attr.trailing]': 'trailingSlot()?.any() || null',
    '[attr.selected]': 'selected() || null',
    '[attr.disabled]': 'disabled() || null',
    '[attr.items]': `itemSlot()?.any() || null`,
  },
})
export class MenuItemComponent extends MaterialDesignComponent {
  readonly checkOnSelected = model(false);
  readonly disabled = model(false);
  readonly href = model<string>();
  readonly anchorTarget = model<string>();
  readonly name = model<string>();
  readonly value = model<string>();
  readonly selected = model(false);

  readonly leadingSlot = this.slotDirective('leading');
  readonly trailingSlot = this.slotDirective('trailing');
  readonly itemSlot = this.slotDirective('item');

  readonly button =
    viewChild<ElementRef<HTMLButtonElement | HTMLAnchorElement>>('button');

  readonly subMenu = viewChild<MenuComponent>('menu');

  readonly dir = textDirection();
  readonly placement = computed(() =>
    this.dir() === 'ltr' ? 'right-start' : 'left-start'
  );

  constructor() {
    super();
    this.setSlots(MenuItemComponent, (x) => (x.hostElement.slot = 'item'));
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.itemSlot()?.any()) {
      if (this.hostElement === event.target) {
        this.subMenu()?.popover()?.open.set?.(true);
      }
    } else {
      this.hostElement.dispatchEvent(
        new Event('close-popover', { bubbles: true })
      );
    }
  }
}
