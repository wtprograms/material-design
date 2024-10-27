import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  model,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';
import { RippleComponent } from '../ripple/ripple.component';
import { CommonModule } from '@angular/common';
import { PopoverComponent, PopoverTrigger } from '../popover/popover.component';
import { textDirection } from '../../common/rxjs/text-direction';
import { tap, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SlotDirective } from '../../directives/slot.directive';
import { OpenCloseState } from '../../common/rxjs/open-close';

export type FieldVariant = 'filled' | 'outlined';

@Component({
  selector: 'md-field',
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [SlotDirective, RippleComponent, CommonModule, PopoverComponent],
  hostDirectives: [],
  host: {
    '[attr.variant]': 'variant()',
    '[attr.populated]': 'populated()',
    '[attr.disabled]': 'disabled()',
    '[attr.error]': '!!errorText() || null',
    '[attr.label]': '!!label() || null',
    '[attr.leading]': `leadingSlot()?.any() || null`,
    '[attr.trailing]': `trailingSlot()?.any() || null`,
    '[attr.prefix]': `prefixSlot()?.any() || null`,
    '[attr.suffix]': `suffixSlot()?.any() || null`,
    '[attr.supportingText]': `supportingTextSlot()?.any() || null`,
    '[attr.counter]': 'counterSlot()?.any() || null',
  },
})
export class FieldComponent<TValue>
  extends MaterialDesignValueAccessorComponent<TValue>
  implements AfterViewInit
{
  override readonly value = model<TValue>();
  readonly variant = model<FieldVariant>('filled');
  readonly label = model<string>();
  readonly populated = model(false);
  readonly contentClick = output<Event>();
  readonly bodyClick = output<Event>();
  private readonly _labelSpan =
    viewChild<ElementRef<HTMLSpanElement>>('labelSpan');
  private readonly _content = viewChild<ElementRef<HTMLSpanElement>>('content');
  readonly popover = viewChild<PopoverComponent>('popover');
  private readonly _textDirection = textDirection();
  readonly open = model(false);
  readonly popoverTrigger = model<PopoverTrigger>('click');
  readonly maxPopoverHeight = model<number>();
  readonly popoverStateChange = output<OpenCloseState>();
  readonly hasFooter = model(true);

  readonly leadingSlot = this.slotDirective('leading');
  readonly popoverSlot = this.slotDirective('popover');
  readonly trailingSlot = this.slotDirective('trailing');
  readonly supportingTextSlot = this.slotDirective('supporting-text');
  readonly counterSlot = this.slotDirective('counter');
  readonly prefixSlot = this.slotDirective('prefix');
  readonly suffixSlot = this.slotDirective('suffix');

  private readonly _labelStart = computed(() => {
    this.leadingSlot()?.any();
    this.label();
    const content = this._content()!.nativeElement;
    if (this.populated() && this.variant() === 'outlined') {
      return 16;
    }
    const offsetLeft = content.offsetLeft;
    const offsetRight = content.offsetParent
      ? (content.offsetParent as HTMLElement).offsetWidth -
        (content.offsetLeft + content.offsetWidth)
      : 0;
    const start = this._textDirection() === 'ltr' ? offsetLeft : offsetRight;
    return start;
  });

  private readonly _transition = signal('none');

  readonly labelStyle = computed(
    (): Partial<CSSStyleDeclaration> => ({
      insetInlineStart: `${this._labelStart()}px`,
      transition: this._transition(),
    })
  );

  readonly contentStyle = computed(
    (): Partial<CSSStyleDeclaration> => ({
      transition: this._transition(),
    })
  );

  private readonly _labelWidth = computed(() =>
    this.populated() && !!this._labelSpan()?.nativeElement.offsetWidth
      ? this._labelSpan()!.nativeElement.offsetWidth
      : 10
  );

  readonly borderTopEndStyle = computed(
    (): Partial<CSSStyleDeclaration> => ({
      marginInlineStart:
        this._labelWidth() === 10 ? '' : `${10 + 4 + this._labelWidth() + 6}px`,
    })
  );

  private readonly _destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    timer(100)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap(() => this._transition.set(''))
      )
      .subscribe();
  }
}
