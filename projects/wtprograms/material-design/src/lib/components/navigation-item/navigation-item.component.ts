import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  model,
  viewChild,
  ElementRef,
  inject,
  computed,
} from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { IconComponent } from '../icon/icon.component';
import { MaterialDesignComponent } from '../material-design.component';
import {
  NavigationLayout,
  NavigationComponent,
} from '../navigation/navigation.component';
import { RippleComponent } from '../ripple/ripple.component';
import { TouchAreaComponent } from '../touch-area/touch-area.component';
import { SlotDirective } from '../../directives/slot.directive';

@Component({
  selector: 'md-navigation-item',
  templateUrl: './navigation-item.component.html',
  styleUrl: './navigation-item.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    IconComponent,
    TouchAreaComponent,
    FocusRingComponent,
    RippleComponent,
    CommonModule,
    BadgeComponent,
    SlotDirective,
  ],
  hostDirectives: [],
  host: {
    '[attr.selected]': 'selected() || null',
    '[attr.layout]': 'parentLayout()',
    '[attr.disabled]': 'disabled() || null',
    '[attr.label]': `labelSlot()?.any() || null`,
    '[attr.icon]': `iconSlot()?.any() || null`,
  },
})
export class NavigationItemComponent extends MaterialDesignComponent {
  readonly selected = model(false);
  readonly custom = model(false);
  readonly layout = model<NavigationLayout>('bar');
  readonly disabled = model(false);
  readonly href = model<string>();
  readonly anchorTarget = model<string>();
  readonly name = model<string>();
  readonly value = model<string>();
  readonly progressIndeterminate = model(false);
  readonly progressValue = model(0);
  readonly progressMax = model(0);
  readonly badgeDot = model(false);
  readonly badgeNumber = model<number>();

  readonly labelSlot = this.slotDirective('label');
  readonly iconSlot = this.slotDirective();

  readonly button =
    viewChild<ElementRef<HTMLButtonElement | HTMLAnchorElement>>('button');

  readonly _parent = inject(NavigationComponent, {
    optional: true,
    host: true,
  });

  readonly parentLayout = computed(() => {
    if (!this._parent) {
      return this.layout();
    }
    return this._parent.layout();
  });
}
