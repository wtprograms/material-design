import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdBadgeComponent } from '../badge/badge.component';
import { MdEmbeddedBadgeDirective } from '../badge/embedded-badge.directive';
import { MdEmbeddedButtonComponent } from '../embedded-button/embedded-button.component';
import { MdFocusRingComponent } from '../focus-ring/focus-ring.component';
import { MdIconComponent } from '../icon/icon.component';
import { MdRippleComponent } from '../ripple/ripple.component';
import { MdTintComponent } from '../tint/tint.component';
import { SegmentedButtonType } from './segmented-button-type';
import { MdValueAccessorComponent } from '../../common/base/value-accessor/md-value-accessor.component';

@Component({
  selector: 'md-segmented-button',
  templateUrl: './segmented-button.component.html',
  styleUrls: ['./segmented-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MdEmbeddedButtonComponent,
    MdBadgeComponent,
    MdFocusRingComponent,
    MdTintComponent,
    MdRippleComponent,
    MdIconComponent,
  ],
  hostDirectives: [
    {
      directive: MdEmbeddedBadgeDirective,
      inputs: ['dot: badgeDot', 'text: badgeText'],
    },
  ],
  host: {
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.selected]': 'selected() ? "" : null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdSegmentedButtonComponent),
    },
  ],
})
export class MdSegmentedButtonComponent extends MdValueAccessorComponent<
  string | boolean | number
> {
  readonly embeddedBadge = inject(MdEmbeddedBadgeDirective);
  readonly type = model<SegmentedButtonType>('button');
  readonly href = input<string>();
  readonly target = input<string>();
  readonly selected = model(false);
  readonly useCheckIcon = input(false);
  readonly radioValue = input<string | boolean | number>();

  constructor() {
    super();
    effect(() => {
      const type = this.type();
      const value = this.value();
      const radioValue = this.radioValue();
      const selected = this.selected();
      if (type === 'radio') {
        this.selected.set(value === radioValue);
      } else if (type === 'checkbox') {
        this.value.set(selected);
      }
    });
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.type() === 'radio') {
      this.value.set(this.radioValue());
    } else {
      this.selected.set(input.checked);
    }
  }
}
