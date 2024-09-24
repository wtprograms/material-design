/* eslint-disable @typescript-eslint/no-explicit-any */
import '../badge';
import { html, LitElement, nothing } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { styles } from './styles';
import {
  getFormValue,
  internals,
  mixinElementInternals,
  mixinFormAssociated,
  mixinStringValue,
  observe,
  redispatchEvent,
  TextFieldValidator,
  Validator,
} from '../../common';
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
import { live } from 'lit/directives/live.js';
import {
  mixinOnReportValidity,
  onReportValidity,
} from '../../common/mixins/mixin-on-report-validity';
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '../../common/mixins/mixin-constraint-validation';

export type TextFieldType =
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'url'
  | 'textarea';

export type UnsupportedTextFieldType =
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'file'
  | 'month'
  | 'time'
  | 'week';

export type InvalidTextFieldType =
  | 'button'
  | 'checkbox'
  | 'hidden'
  | 'image'
  | 'radio'
  | 'range'
  | 'reset'
  | 'submit';

const base = mixinStringValue(
  mixinField(
    mixinOnReportValidity(
      mixinConstraintValidation(
        mixinFormAssociated(mixinElementInternals(LitElement))
      )
    )
  )
);

@customElement('md-text-field')
export class MdTextFieldElement extends base {
  static override styles = [styles];

  @property({ type: String })
  type: TextFieldType = 'text';

  @property({ type: Number })
  min = -1;

  @property({ type: Number })
  max = -1;

  @property({ type: Number, attribute: 'min-length' })
  minLength = -1;

  @property({ type: Number, attribute: 'max-length' })
  maxLength = -1;

  @property({ type: Boolean })
  counter = false;

  @property({ type: String })
  autocomplete: string | null = 'off';

  @property()
  pattern = '';

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: Boolean, reflect: true })
  readOnly = false;

  @property({ type: Boolean, reflect: true })
  multiple = false;

  @property({ reflect: true })
  override inputMode = '';

  @query('input, textarea')
  private _input!: HTMLInputElement | HTMLTextAreaElement;

  get selectionDirection() {
    return this._input.selectionDirection;
  }
  set selectionDirection(value: 'forward' | 'backward' | 'none' | null) {
    this._input.selectionDirection = value;
  }

  get selectionEnd() {
    return this._input.selectionEnd;
  }
  set selectionEnd(value: number | null) {
    this._input.selectionEnd = value;
  }

  get selectionStart() {
    return this._input.selectionStart;
  }
  set selectionStart(value: number | null) {
    this._input.selectionStart = value;
  }

  get valueAsNumber() {
    const input = this._input instanceof HTMLInputElement ? this._input : null;
    if (!input) {
      return NaN;
    }

    return input.valueAsNumber;
  }
  set valueAsNumber(value: number) {
    const input = this._input instanceof HTMLInputElement ? this._input : null;
    if (!input) {
      return;
    }

    input.valueAsNumber = value;
    this.value = input.value;
  }

  @query('md-field')
  private _field!: MdFieldElement;

  @queryAssignedElements({ slot: 'item' })
  private _items!: HTMLElement[];

  @property({ type: Boolean })
  hasItems = false;

  @state()
  private _nativeErrorText = '';

  @state()
  private _dirty = false;

  private get hasError() {
    return this.errorText || this._nativeErrorText;
  }

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  select() {
    this._input.select();
  }

  setRangeText(replacement: string): void;
  setRangeText(
    replacement: string,
    start: number,
    end: number,
    selectionMode?: SelectionMode
  ): void;
  setRangeText(...args: unknown[]) {
    // Calling setRangeText with 1 vs 3-4 arguments has different behavior.
    // Use spread syntax and type casting to ensure correct usage.
    this._input.setRangeText(
      ...(args as Parameters<HTMLInputElement['setRangeText']>)
    );
    this.value = this._input.value;
  }
  setSelectionRange(
    start: number | null,
    end: number | null,
    direction?: 'forward' | 'backward' | 'none'
  ) {
    this._input.setSelectionRange(start, end, direction);
  }

  reset() {
    this.value = this.getAttribute('value') ?? '';
    this._nativeErrorText = '';
    this.errorText = '';
    this._dirty = false;
  }

  override attributeChangedCallback(
    attribute: string,
    newValue: string | null,
    oldValue: string | null
  ) {
    if (attribute === 'value' && this._dirty) {
      // After user input, changing the value attribute no longer updates the
      // text field's value (until reset). This matches native <input> behavior.
      return;
    }

    super.attributeChangedCallback(attribute, newValue, oldValue);
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
    const inputMode = this.inputMode as any;
    const hasMaxLength = (this.maxLength ?? -1) > -1;
    const hasMinLength = (this.minLength ?? -1) > -1;
    return html`<input
      type=${this.type}
      min=${(this.min || nothing) as unknown as number}
      max=${(this.max || nothing) as unknown as number}
      maxlength=${hasMaxLength ? this.maxLength : nothing}
      minlength=${hasMinLength ? this.minLength : nothing}
      autocomplete=${ifDefined(this.autocomplete)}
      ?required=${this.required}
      ?multiple=${this.multiple}
      pattern=${this.pattern}
      @focus=${this.handleFocus}
      inputmode=${inputMode || nothing}
      @blur=${this.handleBlur}
      @input=${this.handleInput}
      ?disabled=${this.disabled}
      @keyup=${this.handleKeyUp}
      .value=${live(this.value)}
      @select=${this.redispatchEvent}
      @change=${this.redispatchEvent}
    />`;
  }

  private renderTextArea() {
    const inputMode = this.inputMode as any;
    const hasMaxLength = (this.maxLength ?? -1) > -1;
    const hasMinLength = (this.minLength ?? -1) > -1;
    return html`<textarea
      rows="1"
      maxlength=${hasMaxLength ? this.maxLength : nothing}
      minlength=${hasMinLength ? this.minLength : nothing}
      @focus=${this.handleFocus}
      @blur=${this.handleBlur}
      @input=${this.handleInput}
      ?disabled=${this.disabled}
      .value=${live(this.value)}
      ?required=${this.required}
      ?multiple=${this.multiple}
      pattern=${this.pattern}
      inputmode=${inputMode || nothing}
    ></textarea>`;
  }

  override focus(options?: FocusOptions): void {
    this._input.focus(options);
  }

  override blur(): void {
    this._input.blur();
  }

  private redispatchEvent(event: Event) {
    redispatchEvent(this, event);
  }

  private handleKeyUp(event: KeyboardEvent) {
    redispatchEvent(this, event);
    if (this.type !== 'textarea' && event.key === 'Enter') {
      this[internals].form?.dispatchEvent(new Event('submit'));
    }
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      element.addEventListener('click', (event: any) => {
        this.value = event.target.value;
      });
    }
  }

  override [getFormValue]() {
    return this.value;
  }

  override formResetCallback() {
    this.reset();
  }

  override formStateRestoreCallback(state: string) {
    this.value = state;
  }

  override [createValidator](): Validator<unknown> {
    return new TextFieldValidator(() => ({
      state: this as any,
      renderedControl: this._input,
    }));
  }

  override [getValidityAnchor](): HTMLElement | null {
    return this._input;
  }

  override [onReportValidity](invalidEvent: Event | null) {
    // Prevent default pop-up behavior.
    invalidEvent?.preventDefault();

    const prevMessage = this.errorText;
    this._nativeErrorText = this.validationMessage;

    if (prevMessage === this.errorText) {
      this._field!.errorText = null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-text-field': MdTextFieldElement;
  }
}
