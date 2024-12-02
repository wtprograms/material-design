import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MdComponent } from '../md.component';
import { CommonModule } from '@angular/common';
import { MdElevationComponent } from '../elevation/elevation.component';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.component';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.component';
import { MdProgressIndicatorUserDirective } from '../progress-indicator/progress-indicator-user.directive';
import { MdProgressIndicatorModule } from '../progress-indicator/progress-indicator.module';
import { MdRippleComponent } from '../ripple/ripple.component';
import { ButtonType } from '../button/button.component';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

const ELEVATION_VARIANTS: CardVariant[] = ['elevated', 'filled'];

@Component({
  selector: 'md-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdElevationComponent,
    MdFocusRingComponent,
    MdEmbeddedButtonComponent,
    MdRippleComponent,
    CommonModule,
    MdProgressIndicatorModule
  ],
  hostDirectives: [
    {
      directive: MdProgressIndicatorUserDirective,
      inputs: [
        'progressValue',
        'progressMax',
        'progressIndeterminate',
      ]
    }
  ],
  host: {
    '[class]': 'variant()',
    '[class.disabled]': 'disabled()',
  },
})
export class MdCardComponent extends MdComponent {
  readonly progressIndicatorUser = inject(MdProgressIndicatorUserDirective);
  readonly variant = input<CardVariant>('outlined');
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly interactive = input(false);
  readonly hasElevation = computed(() =>
    ELEVATION_VARIANTS.includes(this.variant())
  );
  readonly elevationLevel = computed(() =>
    this.variant() !== 'elevated' ? 0 : 1
  );

}