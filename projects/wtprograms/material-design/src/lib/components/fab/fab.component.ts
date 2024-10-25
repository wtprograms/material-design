import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  model,
  viewChild,
  ElementRef,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormSubmitterType } from '../../common/forms/form-submitted-type';
import { openClose } from '../../common/rxjs/open-close';
import { AnimationDirective } from '../../directives/animation/animation.directive';
import { attachTarget } from '../../directives/attachable.directive';
import { ForwardFocusDirective } from '../../directives/forward-focus.directive';
import { ElevationComponent } from '../elevation/elevation.component';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { IconComponent } from '../icon/icon.component';
import { MaterialDesignComponent } from '../material-design.component';
import { ProgressIndicatorComponent } from '../progress-indicator/progress-indicator.component';
import { RippleComponent } from '../ripple/ripple.component';
import { TouchAreaComponent } from '../touch-area/touch-area.component';
import { SlotDirective } from '../../directives/slot.directive';

export type FabPalette =
  | 'surface'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'warning'
  | 'success';

export type FabSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'md-fab',
  templateUrl: './fab.component.html',
  styleUrl: './fab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: true,
  imports: [
    ProgressIndicatorComponent,
    TouchAreaComponent,
    ElevationComponent,
    RippleComponent,
    FocusRingComponent,
    CommonModule,
    SlotDirective,
    AnimationDirective,
    IconComponent,
  ],
  hostDirectives: [ForwardFocusDirective],
  host: {
    '[attr.palette]': 'palette()',
    '[attr.size]': 'size()',
    '[attr.disabled]': 'disabled()',
    '[attr.icon]': `iconSlot()?.any() || null`,
    '[attr.label]': 'labelSlot()?.any() || null',
    '[attr.state]': 'state()',
  },
})
export class FabComponent extends MaterialDesignComponent {
  readonly palette = model<FabPalette>('primary');
  readonly size = model<FabSize>('medium');
  readonly lowered = model(false);
  readonly disabled = model(false);
  readonly type = model<FormSubmitterType>('button');
  readonly href = model<string>();
  readonly anchorTarget = model<string>();
  readonly name = model<string>();
  readonly value = model<string>();
  readonly extended = model(false);

  readonly iconSlot = this.slotDirective();
  readonly labelSlot = this.slotDirective('label');

  readonly button =
    viewChild<ElementRef<HTMLButtonElement | HTMLAnchorElement>>('button');

  readonly elevationLevel = computed(() => (this.lowered() ? 1 : 3));
  private readonly _openClose$ = openClose(this.extended);
  readonly state = toSignal(this._openClose$, {
    initialValue: 'closed',
  });

  constructor() {
    super();
    attachTarget(ForwardFocusDirective, this.button);
  }
}
