import '../badge';
import { html, LitElement, nothing } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinStringValue, observe, redispatchEvent } from '../../common';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  tap,
} from 'rxjs';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MdFieldElement } from '../field';
import { mixinField } from '../../common/mixins/mixin-field';

export type TextFieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea';

const base = mixinStringValue(mixinField(LitElement));

@customElement('md-text-field')
export class MdTextFieldElement extends base {
  static override styles = [styles];

  @property({ type: String })
  type: TextFieldType = 'text';

  @property({ type: Number })
  min: number | null = null;

  @property({ type: Number })
  max: number | null = null;

  @property({ type: Number, attribute: 'min-length' })
  minLength: number | null = null;

  @property({ type: Number, attribute: 'max-length' })
  maxLength: number | null = null;

  @property({ type: Boolean })
  counter = false;

  @property({ type: String })
  autocomplete: string | null = 'off';

  @query('input, textarea')
  private _input!: HTMLInputElement | HTMLTextAreaElement;

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

  private readonly _count$ = this.value$.pipe(
    map((value) => value?.length ?? 0),
    map((value) => {
      if (this.maxLength && this.counter) {
        return this.counter ? `${value}/${this.maxLength}` : nothing;
      } else if (this.counter) {
        return this.counter;
      }
      return nothing;
    })
  );

  override connectedCallback(): void {
    super.connectedCallback();
    this.value$
      .pipe(
        distinctUntilChanged(),
        filter(() => this.hasItems),
        tap((value) => {
          if (value) {
            for (const item of this._items) {
              if (
                item.getAttribute('value')?.toLocaleLowerCase()?.includes(value)
              ) {
                item.style.display = '';
              } else {
                item.style.display = 'none';
              }
            }
          } else {
            for (const item of this._items) {
              item.style.display = '';
            }
          }
          for (const item of this._items as any[]) {
            if (!!item.value) {
              item.selected = item.value === value;
            }
          }
        })
      )
      .subscribe();
    this.value$
      .pipe(
        distinctUntilChanged(),
        filter(() => !!this._input),
        tap((value) => (this._input.value = value ?? ''))
      )
      .subscribe();
  }

  override render() {
    return html`<md-field
      counter=${observe(this._count$)}
      variant=${this.variant}
      ?populated=${observe(this._populated$)}
      supporting-text=${ifDefined(this.supportingText)}
      error-text=${ifDefined(this.errorText)}
      label=${ifDefined(this.label)}
      prefix-text=${ifDefined(this.prefixText)}
      suffix-text=${ifDefined(this.suffixText)}
      ?disabled=${this.disabled}
      @content-click=${this.contentClick}
    >
      ${this.renderControl()}
      <slot name="leading" slot="leading"></slot>
      <slot name="trailing" slot="trailing"></slot>
      <slot
        name="item"
        slot="popover"
        @slotchange=${this.onItemsSlotChange}
      ></slot>
    </md-field>`;
  }

  private contentClick() {
    this._input.focus();
    if (this.hasItems) {
      this._field.openPopover();
    }
  }

  private renderControl() {
    return this.type === 'textarea'
      ? this.renderTextArea()
      : this.renderInput();
  }

  private renderInput() {
    return html`<input
      type=${this.type}
      min=${ifDefined(this.min)}
      max=${ifDefined(this.max)}
      minlength=${ifDefined(this.minLength)}
      maxlength=${ifDefined(this.maxLength)}
      autocomplete=${ifDefined(this.autocomplete)}
      @focus=${this.handleFocus}
      @blur=${this.handleBlur}
      @input=${this.handleInput}
      ?disabled=${this.disabled}
    />`;
  }

  private renderTextArea() {
    return html`<textarea
      rows="1"
      minlength=${ifDefined(this.minLength)}
      maxlength=${ifDefined(this.maxLength)}
      @focus=${this.handleFocus}
      @blur=${this.handleBlur}
      @input=${this.handleInput}
      ?disabled=${this.disabled}
    ></textarea>`;
  }

  override focus(options?: FocusOptions): void {
    this._input.focus(options);
  }

  override blur(): void {
    this._input.blur();
  }

  private handleFocus() {
    this._focused$.next(true);
  }

  private handleBlur() {
    this._focused$.next(false);
  }

  private handleInput(event: InputEvent) {
    this.value = this._input.value;
    if (this.type === 'textarea') {
      this._input.style.height = 'auto';
      this._input.style.height = this._input.scrollHeight + 'px';
    }
    redispatchEvent(this, event);
    if (this.hasItems) {
      this._field.openPopover();
    }
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
    'md-text-field': MdTextFieldElement;
  }
}
