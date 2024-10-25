import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { SlotDirective } from '../../directives/slot.directive';
import { TabComponent } from '../tab/tab.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, merge, pairwise, startWith, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'md-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [SlotDirective, CommonModule],
  hostDirectives: [],
  host: {
    '[attr.secondary]': 'secondary() || null',
  },
})
export class TabsComponent extends MaterialDesignComponent {
  readonly secondary = model(false);
  readonly selectedTab$ = toObservable(this.defaultSlot).pipe(
    filter((x) => !!x),
    map((slots) =>
      slots
        .componentsOf(TabComponent)
        .map((tab) =>
          tab.selected$.pipe(map((selected) => ({ tab, selected })))
        )
    ),
    switchMap((tabs) => merge(...tabs)),
    filter((x) => x.selected),
    map((x) => x.tab)
  );
  readonly selectedTab = toSignal(
    this.selectedTab$.pipe(
      startWith(undefined),
      pairwise(),
      tap(([previous]) => previous?.selected?.set(false)),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map(([_, current]) => current)
    )
  );
  readonly indicatorStyle = computed<Partial<CSSStyleDeclaration>>(() => {
    const selectedTab = this.selectedTab();
    const secondary = this.secondary();
    if (!selectedTab) {
      return {
        marginInlineStart: '0',
        width: '0',
        opacity: '0',
      };
    }
    const left = secondary
      ? selectedTab.hostElement.offsetLeft
      : selectedTab.hostElement.offsetLeft +
        selectedTab.hostElement.offsetWidth / 2 -
        selectedTab.contentWidth() / 2;
    return {
      marginInlineStart: `${left - 16}px`,
      width: `${selectedTab.contentWidth()}px`,
    };
  });

  constructor() {
    super();

    this.setSlots(TabComponent, (x) => x.secondary.set(this.secondary()));
  }
}
