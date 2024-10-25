import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  model,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { TouchAreaComponent } from '../touch-area/touch-area.component';
import { SlotDirective } from '../../directives/slot.directive';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { RippleComponent } from '../ripple/ripple.component';
import { CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'md-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    TouchAreaComponent,
    SlotDirective,
    FocusRingComponent,
    RippleComponent,
    CommonModule,
  ],
  hostDirectives: [],
  host: {
    '[attr.selected]': 'selected() || null',
    '[attr.secondary]': 'secondary() || null',
    '[attr.disabled]': 'disabled() || null',
  },
})
export class TabComponent extends MaterialDesignComponent {
  readonly secondary = model(false);
  readonly disabled = model(false);
  readonly href = model<string>();
  readonly anchorTarget = model<string>();
  readonly name = model<string>();
  readonly value = model<string>();
  readonly selected = model(false);
  readonly selected$ = toObservable(this.selected);

  readonly labelSlot = this.slotDirective('label');

  private readonly _label = viewChild<ElementRef<HTMLElement>>('label');

  readonly contentWidth = computed(() => {
    const icon = this.defaultSlot()?.elements()[0];
    this.labelSlot();
    const secondary = this.secondary();
    const label = this._label()?.nativeElement;
    if (secondary) {
      return this.hostElement.offsetWidth;
    }
    const iconWidth = icon ? icon.offsetWidth : 0;
    const labelWidth = label ? label.offsetWidth : 0;
    return Math.max(iconWidth, labelWidth) + 8;
  });

  readonly button =
    viewChild<ElementRef<HTMLButtonElement | HTMLAnchorElement>>('button');

  @HostListener('click')
  click() {
    this.selected.set(true);
  }
}
