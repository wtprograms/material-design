import {
  computed,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  PLATFORM_ID,
  Type,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { MaterialDesignComponent } from '../components/material-design.component';
import { isPlatformServer } from '@angular/common';

export type Slots =
  | 'leading'
  | 'trailing'
  | 'icon'
  | 'selected-value'
  | 'headline'
  | 'supporting-text'
  | 'action'
  | 'counter'
  | 'unchecked-icon'
  | 'checked-icon'
  | 'prefix'
  | 'suffix'
  | 'item'
  | 'label'
  | string;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'slot',
  standalone: true,
  host: {
    '[attr.name]': 'name() ?? null',
    '[attr.slot]': 'slot() ?? null',
  },
})
export class SlotDirective {
  readonly name = input<Slots>();
  readonly slot = input<Slots>();

  private readonly _hostElement =
    inject<ElementRef<HTMLSlotElement>>(ElementRef);
  private readonly _platformId = inject(PLATFORM_ID);

  private get _assignedNodes() {
    if (isPlatformServer(this._platformId)) {
      return [];
    }
    return (
      this._hostElement.nativeElement.assignedNodes({ flatten: true }) ?? []
    );
  }

  readonly assignedNodes$ = new BehaviorSubject<Node[]>(this._assignedNodes);
  readonly nodes = toSignal(this.assignedNodes$, {
    initialValue: this._assignedNodes,
  });
  readonly length = computed(() => this.nodes().length);
  readonly any = computed(() => !!this.length());
  readonly elements = computed(() =>
    this.nodes().filter((node) => node instanceof HTMLElement)
  );
  readonly components = computed(() =>
    this.elements()
      .map((element) => MaterialDesignComponent.get(element))
      .filter((component) => !!component)
  );

  elementsOf<T extends HTMLElement>(...types: Type<T>[]) {
    return Array.from(this.filterType(this.elements(), ...types));
  }

  componentsOf<T extends MaterialDesignComponent>(...types: Type<T>[]) {
    return Array.from(this.filterType(this.components(), ...types));
  }

  @HostListener('slotchange')
  onSlotChange() {
    this.assignedNodes$.next(this._assignedNodes);
  }

  private *filterType<T>(items: unknown[], ...types: Type<T>[]): Iterable<T> {
    for (const item of items) {
      for (const type of types) {
        if (item instanceof type) {
          yield item;
        }
      }
    }
  }
}
