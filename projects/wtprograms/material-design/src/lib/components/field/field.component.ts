import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  linkedSignal,
  output,
  viewChild,
} from '@angular/core';
import { MdComponent } from '../md.component';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { observeResize, observeResize$ } from '../../common/signals/observe-resize';
import { filter, map, switchMap } from 'rxjs';
import { MdRippleComponent } from '../ripple/ripple.component';

export type FieldVariant = 'filled' | 'outlined';

@Component({
  selector: 'md-field',
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MdRippleComponent],
  host: {
    '[class]': 'variant()',
    '[class.disabled]': 'disabled()',
    '[class.error]': '!!error()',
    '[class.populated]': 'populated()',
  },
})
export class MdFieldComponent extends MdComponent {
  readonly label = input<string>();
  readonly error = input<string | boolean>(false);
  readonly variant = input<FieldVariant>('filled');
  readonly disabled = input(false);
  readonly populated = input(false);
  readonly inputContainerClick = output<Event>();
  readonly bodyClick = output<Event>();
  readonly body = viewChild<ElementRef<HTMLElement>>('body');
  readonly supportingText = input<string>();
  readonly counter = input<string>();
  readonly prefix = input<string>();
  readonly suffix = input<string>();

  private readonly _leadingElement =
    viewChild<ElementRef<HTMLElement>>('leadingElement');

  private readonly _leadingWidth = toSignal(
    toObservable(this._leadingElement).pipe(
      filter((x) => !!x),
      switchMap((leading) => observeResize$(leading.nativeElement).pipe(map((x) => x.width)))
    ),
    {
      initialValue: 0,
    }
  );

  readonly labelStart = computed(() => {
    const leadingWidth = this._leadingWidth();
    if (!this.populated() || this.variant() === 'filled') {
      return leadingWidth ? 12 + leadingWidth + 16 : 16;
    }
    return 16;
  });
  readonly borderStart = computed(() => {
    if (!this.populated() || this.variant() === 'filled' || !this.label()) {
      return 12;
    }
    const labelElement = document.createElement('span');
    labelElement.innerText = this.label()!;
    labelElement.className = 'label small';
    this.hostElement.querySelector('.label.small')!.appendChild(labelElement);
    const labelWidth = labelElement.offsetWidth;
    const width = labelWidth + 20;
    labelElement.remove();
    return width;
  });
  constructor() {
    super();
    effect(() => this.label());
  }
}
