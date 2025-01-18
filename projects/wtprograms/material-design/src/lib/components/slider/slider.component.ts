import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdPopoverComponent } from '../popover/popover.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MdValueAccessorComponent } from '../../common/base/value-accessor/md-value-accessor.component';
import { observeResize$ } from '../../common/rxjs/observe-resize';

@Component({
  selector: 'md-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdPopoverComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MdSliderComponent),
    },
  ],
  host: {
    '[style.--_width.px]': 'width()',
    '[style.--_start-position.px]': 'startPosition()',
    '[style.--_end-position.px]': 'endPosition()',
    '[style.--_max]': 'max()',
    '(pointermove)': 'pointerMove($event)',
  },
})
export class MdSliderComponent extends MdValueAccessorComponent<
  number | [number | undefined, number | undefined]
> {
  readonly step = input(1);
  readonly min = input(0);
  readonly max = input(100);
  readonly ticks = input(false);
  readonly range = input(false);
  readonly endInput = viewChild<ElementRef<HTMLInputElement>>('endInput');
  readonly width = toSignal(
    observeResize$(this.hostElement, this.platformId).pipe(
      map((rect) => rect.width)
    ),
    {
      initialValue: 0,
    }
  );

  readonly startPosition = computed(() => {
    const startValue = this.startValue ?? 0;
    const width = this.width();
    return (
      ((startValue - this.min()) / (this.max() - this.min())) * (width - 4)
    );
  });

  readonly endPosition = computed(() => {
    const endValue = this.endValue ?? 0;
    const width = this.width();
    return ((endValue - this.min()) / (this.max() - this.min())) * (width - 4);
  });

  get startValue(): number | undefined {
    const value = this.value();
    if (this.range()) {
      return Array.isArray(value) ? value[0] : undefined;
    }
    return value as number | undefined;
  }
  set startValue(value: number | undefined) {
    if (this.range()) {
      this.value.update((previous) => {
        if (Array.isArray(previous)) {
          return [value, previous[1]];
        }
        return [value, undefined] as [number | undefined, number | undefined];
      });
    } else {
      this.value.set(value);
    }
  }

  get endValue(): number | undefined {
    const value = this.value();
    if (this.range()) {
      return Array.isArray(value) ? value[1] : undefined;
    }
    return value as number | undefined;
  }
  set endValue(value: number | undefined) {
    if (this.range()) {
      this.value.update((previous) => {
        if (Array.isArray(previous)) {
          return [previous[0], value];
        }
        return [undefined, value] as [number | undefined, number | undefined];
      });
    } else {
      this.value.set(value);
    }
  }

  readonly startHover = signal(false);
  readonly endHover = signal(false);

  constructor() {
    super();
    effect(() => {
      const min = this.min();
      const max = this.max();
      let value = this.value();
      if (this.range() && Array.isArray(value)) {
        if (!!value[0] && value[0] < min) {
          this.startValue = min;
        } else if (!!value[0] && value[0] > max) {
          this.startValue = max;
        }
        if (!!value[1] && value[1] < min) {
          this.endValue = min;
        } else if (!!value[1] && value[1] > max) {
          this.endValue = max;
        }
        return;
      } else if (typeof value === 'number') {
        if (value < min) {
          this.value.set(min);
        } else if (value > max) {
          this.value.set(max);
        }
      }
    });
  }

  setStartValue(event: Event) {
    const input = event.target as HTMLInputElement;
    this.startValue = this.range()
      ? Math.min(this.endValue ?? 0, input.valueAsNumber)
      : input.valueAsNumber;
    input.valueAsNumber = this.startValue;
  }

  setEndValue(event: Event) {
    const input = event.target as HTMLInputElement;
    this.endValue = this.range()
      ? Math.max(this.startValue ?? 0, input.valueAsNumber)
      : input.valueAsNumber;
    input.valueAsNumber = this.endValue;
  }

  pointerMove(event: PointerEvent) {
    if (!this.range()) {
      return;
    }
    const hostRect = this.hostElement.getBoundingClientRect();
    const relativeX = event.clientX - hostRect.left;

    const startPosition = this.startPosition();
    const endPosition = this.endPosition();
    const difference = endPosition - startPosition;

    if (relativeX < endPosition - difference / 2) {
      this.startHover.set(true);
      this.endHover.set(false);
    } else if (relativeX >= startPosition + difference / 2) {
      this.startHover.set(false);
      this.endHover.set(true);
    }
  }
}
