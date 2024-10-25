import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';

export type ProgressIndicatorVariant = 'circular' | 'linear';

@Component({
  selector: 'md-progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrl: './progress-indicator.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  host: {
    '[attr.variant]': 'variant()',
    '[style.--md-comp-progress-indicator-size]': 'size() ?? null',
    '[style.--md-comp-progress-indicator-width]': 'width() ?? null',
  },
})
export class ProgressIndicatorComponent extends MaterialDesignComponent {
  readonly variant = model<ProgressIndicatorVariant>('circular');
  readonly value = model(0);
  readonly max = model(1);
  readonly indeterminate = model(false);
  readonly fourColor = model(false);
  readonly size = model<number>();
  readonly width = model<number>();
  readonly buffer = model(0);
  readonly circleSize = model<number>();
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
