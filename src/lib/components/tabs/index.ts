import { html, LitElement, nothing } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { property$, tapIf } from '../../common';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { MdTabElement } from '../tab';

@customElement('md-tabs')
export class MdTabsElement extends LitElement {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true, attribute: 'hide-label' })
  @property$()
  hideLabel = false;
  hideLabel$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true })
  @property$()
  secondary = false;
  secondary$!: Observable<boolean>;

  @queryAssignedElements({ flatten: true })
  private _tabElements!: MdTabElement[];

  @query('.indicator')
  private _indicator!: HTMLElement;

  private readonly _tabs$ = new BehaviorSubject<MdTabElement[]>([]);
  private _selectedTab$ = new BehaviorSubject<MdTabElement | null>(null);

  override connectedCallback() {
    super.connectedCallback();
    combineLatest({
      tabs: this._tabs$,
      secondary: this.secondary$,
      hideLabel: this.hideLabel$,
    })
      .pipe(
        tap(({ tabs, secondary, hideLabel }) => {
          for (const tab of tabs) {
            tab.secondary = secondary;
            tab.hideLabel = hideLabel;
          }
        })
      )
      .subscribe();
    this._tabs$
      .pipe(
        filter((x) => x.length > 0),
        tap(() =>
          this._selectedTab$.next(
            this._tabElements.find((x) => x.selected) ?? this._tabElements[0]
          )
        )
      )
      .subscribe();
    combineLatest({
      selectedTab: this._selectedTab$,
      secondary: this.secondary$,
    })
      .pipe(
        filter((x) => !!x.selectedTab),
        switchMap((x) =>
          x.selectedTab!.contentWidth$.pipe(
            map((contentWidth) => ({
              tab: x.selectedTab!,
              contentWidth,
              secondary: x.secondary,
            }))
          )
        ),
        map(({ tab, contentWidth, secondary }) => {
          let left = tab.offsetLeft + tab.offsetWidth / 2 - contentWidth / 2;
          let width = contentWidth;
          if (secondary) {
            left = tab.offsetLeft;
            width = tab.offsetWidth;
          } else {
            left = tab.offsetLeft + tab.offsetWidth / 2 - contentWidth / 2;
          }
          return { left, width };
        }),
        tap(({ left, width }) => {
          this._indicator.style.marginInlineStart = `${left}px`;
          this._indicator.style.width = `${width}px`;
        })
      )
      .subscribe();
  }

  override render() {
    return html`<div class="items">
        <slot
          @selected-change=${this.handleSelectChange}
          @slotchange=${this.handleSlotChange}
        ></slot>
      </div>
      <div class="indicator"></div>`;
  }

  private handleSlotChange() {
    this._tabs$.next(this._tabElements);
    if (this._tabElements[0] && !this._tabElements.some((x) => x.selected)) {
      this._tabElements[0].selected = true;
    }
  }

  private handleSelectChange(event: Event) {
    const selectedTab = event.target as MdTabElement;
    if (!selectedTab.selected) {
      return;
    }
    for (const tab of this._tabElements) {
      tab.selected = tab === selectedTab;
    }
    this._selectedTab$.next(selectedTab);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-tabs': MdTabsElement;
  }
}
