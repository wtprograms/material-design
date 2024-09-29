import { html, nothing, PropertyValues } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import {
  attribute,
  mixinStringValue,
  ObservableElement,
  redispatchEvent,
  TimeSpan,
} from '../../common';
import { MdPopoverElement } from '../popover';
import { BehaviorSubject, combineLatest, filter, map, tap } from 'rxjs';
import { live } from 'lit/directives/live.js';

const base = mixinStringValue(ObservableElement);

@customElement('md-search-bar')
export class MdSearchBarElement extends base {
  static override styles = [styles];

  @property({ type: String })
  placeholder = 'Search';

  @query('md-popover')
  private _popover!: MdPopoverElement;

  @queryAssignedElements({ slot: 'header' })
  private _headerSlots!: HTMLElement[];

  @property({ type: Boolean, reflect: true })
  header = false;

  @query('input')
  private _input!: HTMLInputElement;

  private readonly _focused$ = new BehaviorSubject(false);

  private _opening = false;

  constructor() {
    super();
    this.addEventListener('keydown', this.handleKeydown);
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this._focused$
      .pipe(
        filter((x) => x),
        tap(() => (this._popover.open = true))
      )
      .subscribe();
    this._popover.opening$
      .pipe(
        filter((x) => x),
        attribute(this, 'open')
      )
      .subscribe();
    this._popover.open$
      .pipe(
        filter((x) => !x),
        attribute(this, 'open')
      )
      .subscribe();
  }

  override render() {
    return html`<div class="input">
        <md-icon>search</md-icon
        ><input
          placeholder=${this.placeholder}
          @input=${this.handleInput}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          .value=${live(this.value)}
        />
      </div>
      <md-popover
        trigger="manual"
        @opening=${(e) => this.handleOpening(true, e)}
        @closing=${(e) => this.handleOpening(false, e)}
      >
        <div class="header">
          <slot
            name="header"
            @slotchange=${() => (this.header = !!this._headerSlots.length)}
          ></slot>
        </div>
        <div class="body">
          <slot></slot>
        </div>
      </md-popover>`;
  }

  private handleOpening(opening: boolean, event: Event) {
    this._opening = opening;
    redispatchEvent(this, event);
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') {
      return;
    }
    this.value = '';
    this._popover.closeComponent();
    this.dispatchEvent(new Event('cleared'));
  }

  private handleInput(event: InputEvent) {
    if (!this._popover.open && !this._opening) {
      this._popover.open = true;
    }
    this.value = this._input.value;
    redispatchEvent(this, event);
  }

  private handleFocus(event: FocusEvent) {
    this._focused$.next(true);
    if (!this._popover.open && !this._opening) {
      this._popover.open = true;
    }
    redispatchEvent(this, event);
  }

  private handleBlur(event: FocusEvent) {
    this._focused$.next(false);
    redispatchEvent(this, event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-search-bar': MdSearchBarElement;
  }
}
