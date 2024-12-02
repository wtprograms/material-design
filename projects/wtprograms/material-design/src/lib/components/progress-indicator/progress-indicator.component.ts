import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MdComponent } from '../md.component';

export type ProgressIndicatorVariant = 'circular' | 'linear';

@Component({
  selector: 'md-progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrl: './progress-indicator.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.variant]': 'variant()',
    '[style.--md-comp-progress-indicator-size]': 'size() ?? null',
    '[style.--md-comp-progress-indicator-width]': 'width() ?? null',
  },
})
export class MdProgressIndicatorComponent extends MdComponent {
  readonly variant = input<ProgressIndicatorVariant>('circular');
  readonly value = input(0);
  readonly max = input(1);
  readonly indeterminate = input(false);
  readonly fourColor = input(false);
  readonly size = input<number>();
  readonly width = input<number>();
  readonly buffer = input(0);
  readonly dashOffset = computed(() => (1 - this.value() / this.max()) * 100);
  readonly progressStyle = computed<Partial<CSSStyleDeclaration>>(() => ({
    transform: `scaleX(${
      (this.indeterminate() ? 1 : this.value() / this.max()) * 100
    }%)`,
  }));
  readonly dotSize = computed(() =>
    this.indeterminate() || !this.buffer() ? 1 : this.buffer() / this.max()
  );
  readonly dotStyle = computed<Partial<CSSStyleDeclaration>>(() => ({
    transform: `scaleX(${this.dotSize() * 100}%)`,
  }));
  readonly hideDots = computed(
    () =>
      this.indeterminate() ||
      !this.buffer() ||
      this.buffer() >= this.max() ||
      this.value() >= this.max()
  );
}
