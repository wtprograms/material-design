import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  model,
  viewChild,
  ElementRef,
} from '@angular/core';
import { attachTarget } from '../../directives/attachable.directive';
import { ForwardFocusDirective } from '../../directives/forward-focus.directive';
import { IconComponent } from '../icon/icon.component';
import { MaterialDesignComponent } from '../material-design.component';
import { ProgressIndicatorComponent } from '../progress-indicator/progress-indicator.component';
import { TouchAreaComponent } from '../touch-area/touch-area.component';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { RippleComponent } from '../ripple/ripple.component';
import {
  formSubmitter,
  FormSubmitterDirective,
} from '../../directives/form-submitter.directive';
import { ParentActivationDirective } from '../../directives/parent-activation.directive';

export type IconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard';

@Component({
  selector: 'md-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: true,
  imports: [
    ProgressIndicatorComponent,
    IconComponent,
    FocusRingComponent,
    RippleComponent,
    TouchAreaComponent,
    CommonModule,
  ],
  hostDirectives: [
    ForwardFocusDirective,
    FormSubmitterDirective,
    ParentActivationDirective,
  ],
  host: {
    '[attr.variant]': 'variant()',
    '[attr.selected]': 'selected() || null',
    '[attr.busy]': 'progressIndeterminate() || !!progressValue() || null',
    '[attr.disabled]': 'disabled() || null',
  },
})
export class IconButtonComponent extends MaterialDesignComponent {
  readonly disabled = model(false);
  readonly anchorTarget = model<string>();
  readonly name = model<string>();
  readonly value = model<string>();
  readonly progressIndeterminate = model(false);
  readonly progressValue = model(0);
  readonly progressMax = model(0);
  readonly variant = model<IconButtonVariant>('standard');
  readonly selected = model(false);
  readonly custom = model(false);
  readonly badgeDot = model(false);
  readonly badgeNumber = model<number>();

  readonly button =
    viewChild<ElementRef<HTMLButtonElement | HTMLAnchorElement>>('button');

  readonly formSubmitter = formSubmitter();

  constructor() {
    super();
    attachTarget(ForwardFocusDirective, this.button);
    attachTarget(ParentActivationDirective, this.button);
  }
}
