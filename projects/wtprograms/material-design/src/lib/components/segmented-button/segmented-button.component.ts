import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.component';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.component';
import { MdRippleComponent } from '../ripple/ripple.component';
import { CommonModule } from '@angular/common';
import { ButtonType } from '../button/button.component';
import { MdValueAccessorComponent } from '../md-value-accessor.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdBadgeUserDirective } from '../badge/badge-user.directive';
import { MdIconComponent } from '../icon/icon.component';
import { MdBadgeComponent } from '../badge/badge.component';

export type SegmentedButtonType = ButtonType | 'checkbox' | 'radio';

@Component({
  selector: 'md-segmented-button',
  templateUrl: './segmented-button.component.html',
  styleUrl: './segmented-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MdFocusRingComponent,
    MdEmbeddedButtonComponent,
    MdRippleComponent,
    CommonModule,
    MdIconComponent,
    FormsModule,
    MdBadgeComponent,
  ],
  hostDirectives: [
    {
      directive: MdBadgeUserDirective,
      inputs: ['badgeDot', 'badgeNumber'],
    },
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdSegmentedButtonComponent),
    },
  ],
  host: {
    '[class.disabled]': 'disabled()',
    '[class.selected]': 'selectedOrChecked()',
    '[class.show-check-icon]': 'showCheckIcon()',
  },
})
export class MdSegmentedButtonComponent extends MdValueAccessorComponent<
  boolean | string
> {
  readonly badgeUser = inject(MdBadgeUserDirective);
  readonly checked = model(false);
  readonly type = input<SegmentedButtonType>('button');
  readonly href = input<string>();
  readonly target = input<string>();
  readonly selected = input(false);
  readonly showCheckIcon = input(false);

  readonly selectedOrChecked = computed(
    () => this.selected() || this.checked()
  );

  input(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.checked.set(!!input.checked);
  }
}
