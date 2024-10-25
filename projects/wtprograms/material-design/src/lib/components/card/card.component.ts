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
import { FormSubmitterType } from '../../common/forms/form-submitted-type';
import { ElevationComponent } from '../elevation/elevation.component';
import { RippleComponent } from '../ripple/ripple.component';
import { MaterialDesignComponent } from '../material-design.component';
import { ProgressIndicatorComponent } from '../progress-indicator/progress-indicator.component';
import { TouchAreaComponent } from '../touch-area/touch-area.component';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { SlotDirective } from '../../directives/slot.directive';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

@Component({
  selector: 'md-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    CommonModule,
    RippleComponent,
    TouchAreaComponent,
    FocusRingComponent,
    ElevationComponent,
    SlotDirective,
    ProgressIndicatorComponent,
  ],
  hostDirectives: [],
  host: {
    '[attr.variant]': 'variant()',
    '[attr.interactive]': '!!type() || !!href() || null',
    '[attr.leading]': `leadingSlot()?.any()`,
    '[attr.trailing]': `trailingSlot()?.any()`,
    '[attr.disabled]': 'disabled() || null',
    '[attr.busy]': 'progressIndeterminate() || !!progressValue() || null',
  },
})
export class CardComponent extends MaterialDesignComponent {
  readonly variant = model<CardVariant>('outlined');
  readonly disabled = model(false);
  readonly type = model<FormSubmitterType | undefined>(undefined);
  readonly href = model<string>();
  readonly anchorTarget = model<string>();
  readonly name = model<string>();
  readonly value = model<string>();
  readonly progressIndeterminate = model(false);
  readonly progressValue = model(0);
  readonly progressMax = model(0);
  readonly progressBuffer = model(0);

  readonly leadingSlot = this.slotDirective('leading');
  readonly trailingSlot = this.slotDirective('trailing');

  readonly button =
    viewChild<ElementRef<HTMLButtonElement | HTMLAnchorElement>>('button');

  readonly hasElevation = computed(() => this.variant() !== 'outlined');
  readonly elevationLevel = computed(() =>
    this.variant() === 'elevated' ? 1 : 0
  );
}
