/* eslint-disable @typescript-eslint/no-explicit-any */
import '../badge';
import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { observe } from '../../common';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Subject,
  tap,
} from 'rxjs';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MdFieldElement } from '../field';
import { mixinField } from '../../common/mixins/mixin-field';
import { mixinInternalsValue } from '../../common/mixins/mixin-internals-value';

const base = mixinInternalsValue(mixinField(LitElement));

@customElement('md-dropdown-field')
export class MdDropdownFieldElement extends base {
  static override styles = [styles];

  @query('md-field')
  private _field!: MdFieldElement;

  @queryAssignedElements({ slot: 'item' })
  private _items!: HTMLElement[];

  @property({ type: Boolean })
  hasItems = false;

  private readonly _focused$ = new BehaviorSubject(false);
  private readonly _open$ = new Subject<boolean>();
  private readonly _opening$ = new Subject<boolean>();

  private readonly _populated$ = combineLatest({
    focused: this._focused$,
    value: this.value$,
    open: this._open$,
    opening: this._opening$,
  }).pipe(map((x) => x.focused || !!x.value || x.opening));

  override connectedCallback(): void {
    super.connectedCallback();
    this.value$
      .pipe(
        distinctUntilChanged(),
        tap((value) => {
          for (const item of this._items as any[]) {
            if (!!item.value) {
              item.selected = item.value === value;
            }
          }
        })
      )
      .subscribe();
  }

  override render() {
    return html`<md-field
      variant=${this.variant}
      ?populated=${observe(this._populated$)}
      supporting-text=${ifDefined(this.supportingText)}
      error-text=${ifDefined(this.errorText)}
      label=${ifDefined(this.label)}
      prefix-text=${ifDefined(this.prefixText)}
      suffix-text=${ifDefined(this.suffixText)}
      ?disabled=${this.disabled}
      @body-click=${this.bodyClick}
      @open=${() => this._open$.next(true)}
      @opening=${() => this._opening$.next(true)}
      @close=${() => this._open$.next(false)}
      @closing=${() => this._opening$.next(false)}
    >
      ${this.value}
      <slot name="leading" slot="leading"></slot>
      <md-icon slot="trailing">arrow_drop_down</md-icon>
      <slot
        name="item"
        slot="popover"
        @slotchange=${this.onItemsSlotChange}
      ></slot>
    </md-field>`;
  }

  private bodyClick() {
    if (this.hasItems) {
      this._field.openPopover();
    }
  }

  override focus(): void {
    this._focused$.next(true);
  }

  override blur(): void {
    this._focused$.next(false);
  }

  private onItemsSlotChange() {
    this.hasItems = !!this._items.length;
    for (const element of this._items) {
      element.addEventListener('click', (event: any) => {
        this.value = event.target.value;
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-dropdown-field': MdDropdownFieldElement;
  }
}
