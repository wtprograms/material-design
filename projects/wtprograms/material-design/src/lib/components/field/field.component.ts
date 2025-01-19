import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { FieldVariant } from './field-variant';
import { MdComponent } from '../../common/base/md.component';
import { ControlState } from '../../common/base/value-accessor/control-state';
import { MdPopoverComponent } from '../popover/popover.component';
import { MdTintComponent } from '../tint/tint.component';
import { remToPx } from '../../common/rem-to-px';
import { observeResize$ } from '../../common/rxjs/observe-resize';
import { MdResizedDirective } from '../../directives/resized.directive';

@Component({
  selector: 'md-field',
  templateUrl: 'field.component.html',
  styleUrls: ['field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MdResizedDirective, MdTintComponent, MdPopoverComponent],
  host: {
    '[attr.variant]': 'variant()',
    '[attr.state]': 'state() ? state() : null',
    '[attr.populated]': 'populated() ? "" : null',
  },
})
export class MdFieldComponent extends MdComponent implements AfterViewInit {
  readonly variant = input<FieldVariant>('filled');
  readonly disabled = input(false);
  readonly state = model<ControlState>();
  readonly stateMessage = model<string>();
  readonly counterText = input<string>();
  readonly label = input<string>();
  readonly prefixText = input<string>();
  readonly suffixText = input<string>();
  readonly populated = model(false);
  readonly bodyClick = output<Event>();
  readonly open = model(false);
  readonly targetWidth = input(true);

  readonly loaded = signal(false);

  readonly labelRect = signal<DOMRect | undefined>(undefined);

  private readonly _leading = viewChild<ElementRef<HTMLDivElement>>('leading');

  private readonly _leadingWidth = toSignal(
    toObservable(this._leading).pipe(
      filter((leading) => isPlatformBrowser(this.platformId) && !!leading),
      switchMap((leading) =>
        observeResize$(leading!.nativeElement, this.platformId)
      )
    ),
    {
      initialValue: undefined,
    }
  );

  readonly labelStart = computed(() => {
    const label = this.label();
    const populated = this.populated();
    const variant = this.variant();
    const leadingWidth = this._leadingWidth();
    if (!label || !leadingWidth?.width) {
      return remToPx(1);
    }

    const start = leadingWidth ? remToPx(0.75) + leadingWidth.width + remToPx(1) : remToPx(1);
    if (variant === 'filled' || !populated) {
      return start;
    }

    return remToPx(1);
  });

  readonly borderStart = computed(() => {
    const populated = this.populated();
    const variant = this.variant();
    const label = this.label();
    const smallLabelWidth = this.labelRect()?.width ?? 0;
    if (!label || !smallLabelWidth || variant === 'filled' || !populated) {
      return remToPx(0.75);
    }
    return smallLabelWidth + remToPx(1.25);
  });

  onBodyClick(event: Event) {
    this.bodyClick.emit(event);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.loaded.set(true), 500);
  }
}
