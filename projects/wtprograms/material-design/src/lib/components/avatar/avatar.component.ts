import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  model,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { RippleComponent } from '../ripple/ripple.component';
import { ForwardFocusDirective } from '../../directives/forward-focus.directive';
import { CommonModule } from '@angular/common';
import { TouchAreaComponent } from '../touch-area/touch-area.component';
import { ParentActivationDirective } from '../../directives/parent-activation.directive';
import { FormSubmitterType } from '../../common/forms/form-submitted-type';
import { BadgeComponent } from '../badge/badge.component';
import { ProgressIndicatorComponent } from '../progress-indicator/progress-indicator.component';
import { attachTarget } from '../../directives/attachable.directive';
import { FocusRingComponent } from '../focus-ring/focus-ring.component';

export type AvatarPalette =
  | 'surface'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'plain';

@Component({
  selector: 'md-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: true,
  imports: [
    CommonModule,
    TouchAreaComponent,
    FocusRingComponent,
    RippleComponent,
    CommonModule,
    BadgeComponent,
    ProgressIndicatorComponent,
  ],
  hostDirectives: [ForwardFocusDirective, ParentActivationDirective],
  host: {
    '[attr.palette]': 'palette()',
    '[attr.interactive]': '!!type() || !!href() || null',
    '[style.--md-comp-avatar-size]': 'size() ?? null',
    '[attr.disabled]': 'disabled() || null',
    '[attr.busy]': 'progressIndeterminate() || !!progressValue() || null',
  },
})
export class AvatarComponent extends MaterialDesignComponent {
  readonly disabled = model(false);
  readonly type = model<FormSubmitterType | undefined>(undefined);
  readonly href = model<string>();
  readonly anchorTarget = model<string>();
  readonly name = model<string>();
  readonly value = model<string>();
  readonly progressIndeterminate = model(false);
  readonly progressValue = model(0);
  readonly progressMax = model(0);
  readonly badgeDot = model(false);
  readonly badgeNumber = model<number>();
  readonly src = model<string>();
  readonly palette = model<AvatarPalette>('primary');
  readonly fullName = model<string>();
  readonly size = model<number>();
  readonly slot = model<string>();

  readonly button =
    viewChild<ElementRef<HTMLButtonElement | HTMLAnchorElement>>('button');

  readonly initial = computed(() =>
    this.fullName() ? this.fullName()![0] : ''
  );

  constructor() {
    super();
    attachTarget(ForwardFocusDirective, this.button);
    attachTarget(ParentActivationDirective, this.button);
  }
}
