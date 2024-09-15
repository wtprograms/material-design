import '../badge';
import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { observe, property$ } from '../../common';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  tap,
} from 'rxjs';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FieldVariant, MdFieldElement } from '../field';

@customElement('md-dropdown-field')
export class MdDropdownFieldElement extends LitElement {
  static override styles = [styles];

  @property({ type: String })
  variant: FieldVariant = 'filled';

  @property({ type: String })
  label: string | null = null;

  @property({ type: String })
  supportingText: string | null = null;

  @property({ type: String })
  errorText: string | null = null;

  @property({ type: String })
  prefixText: string | null = null;

  @property({ type: String })
  suffixText: string | null = null;

  @property({ type: String })
  @property$()
  value: string | null = null;
  value$!: Observable<string | null>;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @query('md-field')
  private _field!: MdFieldElement;

  @queryAssignedElements({ slot: 'item' })
  private _items!: HTMLElement[];

  @property({ type: Boolean })
  hasItems = false;

  private readonly _focused$ = new BehaviorSubject(false);

  private readonly _populated$ = combineLatest({
    focused: this._focused$,
    value: this.value$,
  }).pipe(map(({ focused, value }) => focused || !!value));

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
          this.dispatchEvent(new Event('change'));
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
