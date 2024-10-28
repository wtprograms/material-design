import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  model,
  viewChild,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { attachTarget } from '../../directives/attachable.directive';
import { ForwardFocusDirective } from '../../directives/forward-focus.directive';
import { IconComponent } from '../icon/icon.component';
import { MaterialDesignComponent } from '../material-design.component';
import { ProgressIndicatorComponent } from '../progress-indicator/progress-indicator.component';
import { TouchAreaComponent } from '../touch-area/touch-area.component';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';
import { RippleComponent } from '../ripple/ripple.component';
import { ParentActivationDirective } from '../../directives/parent-activation.directive';
import { FormGroupDirective } from '@angular/forms';
import { FormSubmitterType } from '../../common/forms/form-submitted-type';

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
  readonly type = model<FormSubmitterType>('button');
  readonly href = model<string>();

  readonly button =
    viewChild<ElementRef<HTMLButtonElement | HTMLAnchorElement>>('button');

    private readonly _formGroup = inject(FormGroupDirective, { optional: true });

  constructor() {
    super();
    attachTarget(ForwardFocusDirective, this.button);
    attachTarget(ParentActivationDirective, this.button);
  }

  @HostListener('click')
  onClick() {
    if (this.href()) {
      return;
    }

    if (this.type() === 'submit') {
      const form = this.hostElement.closest('form');
      form?.requestSubmit();
    } else if (this.type() === 'reset') {
      this._formGroup?.reset();
    }
  }
}
