import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  input,
  QueryList,
  viewChild,
} from '@angular/core';
import { MdComponent } from '../md.component';
import {
  assertValue,
  definedValue,
  DURATION,
  EASING,
  MdTabComponent,
  observeResize,
} from '@wtprograms/material-design';
import {
  combineLatest,
  filter,
  fromEvent,
  map,
  merge,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'md-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.secondary]': 'secondary()',
    '[style.grid-template-columns]': 'columns()',
  },
})
export class MdTabsComponent extends MdComponent {
  readonly secondary = input(false);

  readonly tabs = contentChildren(MdTabComponent);
  readonly columns = computed(() => `repeat(${this.tabs().length}, 1fr)`);

  private readonly _rect = observeResize(this.hostElement);
  private readonly _indicator = viewChild<ElementRef<HTMLElement>>('indicator');

  readonly selectedTab = computed(() => {
    const tabs = this.tabs();
    const selectedTab = tabs.find((tab) => tab.selected());
    return selectedTab;
  });

  constructor() {
    super();
    effect(() => 
      this.animate(this.selectedTab(), this.secondary(), false));
    toObservable(this._rect)
      .pipe(
        tap(() => this.animate(this.selectedTab(), this.secondary(), true))
      )
      .subscribe();
  }

  private async animate(
    tab: MdTabComponent | undefined,
    secondary: boolean,
    rectChange: boolean
  ) {
    const indicator = this._indicator();
    assertValue(indicator);

    if (!tab) {
      indicator.nativeElement.style.height = `0`;
      return;
    }

    const left = tab.hostElement.offsetLeft;
    const start = this.getStart(left, tab.hostElement.offsetWidth, secondary);
    const width = secondary ? tab.hostElement.offsetWidth : 32;

    indicator.nativeElement.style.height = secondary ? `2px` : `3px`;

    if (isPlatformServer(this._platformId) || rectChange) {
      indicator.nativeElement.style.insetInlineStart = `${start}px`;
      indicator.nativeElement.style.width = `${width}px`;
      return;
    }

    const timings: OptionalEffectTiming = {
      easing: EASING.standard,
      duration: DURATION.long1,
      fill: 'forwards',
    };

    const style: any = {
      insetInlineStart: `${start}px`,
      width: `${width}px`,
    };

    const animation = indicator.nativeElement.animate(style, timings);
    await animation.finished.catch(() => {});
    animation.commitStyles();
    animation.cancel();
  }

  private getStart(left: number, width: number, secondary: boolean) {
    return secondary ? left : left + width / 2 - 18;
  }
}
