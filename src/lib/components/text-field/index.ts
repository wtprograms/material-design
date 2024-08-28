import { html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styles } from './styles';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  createValidator,
  Field,
  getFormValue,
  getValidityAnchor,
  internals,
  mixinConstraintValidation,
  mixinElementInternals,
  mixinField,
  mixinFormAssociated,
  mixinOnReportValidity,
  onReportValidity,
  redispatchEvent,
  stringConverter,
  TextFieldValidator,
  Validator,
} from '../../common';

export type TextFieldType =
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'url'
  | 'textarea';

const base = mixinField(
  mixinOnReportValidity(
    mixinConstraintValidation(
      mixinFormAssociated(mixinElementInternals(LitElement))
    )
  )
);

@customElement('md-text-field')
export class MdTextFieldElement extends base {
  static override styles = [styles];

  @property({ type: String, reflect: true })
  type: TextFieldType = 'text';

  @property({ reflect: true })
  override inputMode = '';

  @property({ type: String })
  max = '';

  @property({ type: Number, attribute: 'maxlength' })
  maxLength: number | null = null;

  @property({ type: String })
  min = '';

  @property({ type: Number, attribute: 'minlength' })
  minLength: number | null = null;

  @property({ type: String })
  pattern = '';

  @property({ reflect: true, converter: stringConverter })
  placeholder = '';

  @property({ type: Boolean, reflect: true, attribute: 'readonly' })
  readOnly = false;

  @property({ attribute: 'text-direction' })
  textDirection = '';

  @property({ type: Boolean, reflect: true })
  multiple = false;

  @property()
  step = '';

  get selectionDirection() {
    return this.input.selectionDirection;
  }
  set selectionDirection(value: 'forward' | 'backward' | 'none' | null) {
    this.input.selectionDirection = value;
  }

  get selectionEnd() {
    return this.input.selectionEnd;
  }
  set selectionEnd(value: number | null) {
    this.input.selectionEnd = value;
  }

  get selectionStart() {
    return this.input.selectionStart;
  }
  set selectionStart(value: number | null) {
    this.input.selectionStart = value;
  }

  @state()
  private dirty = false;
  @state()
  private focused = false;
  @state()
  private nativeError = false;
  @state()
  private nativeErrorText = '';

  @query('.input')
  private readonly input!: HTMLInputElement | HTMLTextAreaElement;

  @query('.field')
  private readonly field!: Field | null;

  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  override render() {
    const input =
      this.type === 'textarea' ? this.renderTextArea() : this.renderTextField();
    const count =
      this.minLength || this.maxLength
        ? `${this.value?.length ?? '0'}/${this.maxLength}`
        : nothing;
    let errorText: null | string = null;
    if (this.errorText) {
      errorText = this.errorText;
    } else if (this.nativeErrorText) {
      errorText = this.nativeErrorText;
    }
    return html`<md-field
      counter-text=${count}
      error-text=${ifDefined(errorText)}
      prefix-text=${ifDefined(this.prefixText)}
      suffix-text=${ifDefined(this.suffixText)}
      supporting-text=${ifDefined(this.supportingText)}
      variant=${this.variant}
      ?has-leading=${this.hasLeading}
      ?has-trailing=${this.hasTrailing}
      label=${ifDefined(this.label)}
      ?populated=${this.populated}
      @control-click=${this.onControlClick}
    >
      <slot
        name="leading"
        slot="leading"
        @slotchange=${this.onLeadingAndTrailingSlotChange}
      ></slot>
      ${input}
      <slot
        name="trailing"
        slot="trailing"
        @slotchange=${this.onLeadingAndTrailingSlotChange}
      ></slot>
    </md-field>`;
  }

  private onControlClick() {
    this.input.focus();
  }

  private handleBlurChange(event: Event) {
    this.focused = this.input?.matches(':focus') ?? false;
    this.populated = this.focused || !!this.value;
    this.redispatchEvent(event);
  }

  private handleFocusChange(event: Event) {
    this.focused = this.input?.matches(':focus') ?? false;
    this.populated = this.focused || !!this.value;
    this.redispatchEvent(event);
  }

  private redispatchEvent(event: Event) {
    redispatchEvent(this, event);
  }

  private renderTextField() {
    return html`<input
      class="input"
      ?disabled=${this.disabled}
      inputmode=${ifDefined(this.inputMode)}
      max=${ifDefined(this.max)}
      maxlength=${ifDefined(this.maxLength)}
      min=${ifDefined(this.min)}
      minlength=${ifDefined(this.minLength)}
      pattern=${this.pattern || nothing}
      placeholder=${this.placeholder || nothing}
      ?readonly=${this.readOnly}
      ?required=${this.required}
      ?multiple=${this.multiple}
      step=${ifDefined(this.step)}
      type=${this.type}
      value=${ifDefined(this.value)}
      @change=${this.redispatchEvent}
      @focus=${this.handleFocusChange}
      @blur=${this.handleBlurChange}
      @input=${this.handleInput}
      @select=${this.redispatchEvent}
      @keypress=${this.keypressEvent}
    />`;
  }

  private renderTextArea() {
    return html`<textarea
      class="input"
      ?disabled=${this.disabled}
      inputmode=${ifDefined(this.inputMode)}
      maxlength=${ifDefined(this.maxLength)}
      minlength=${ifDefined(this.minLength)}
      pattern=${this.pattern || nothing}
      placeholder=${this.placeholder || nothing}
      ?readonly=${this.readOnly}
      ?required=${this.required}
      ?multiple=${this.multiple}
      value=${ifDefined(this.value)}
      @change=${this.redispatchEvent}
      @focus=${this.handleFocusChange}
      @blur=${this.handleBlurChange}
      @input=${this.handleInput}
      @select=${this.redispatchEvent}
      rows="1"
    ></textarea>`;
  }

  private keypressEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this[internals].form?.requestSubmit();
    }
  }

  private handleInput(event: InputEvent) {
    this.dirty = true;
    this.value = (event.target as HTMLInputElement).value;
    if (this.type === 'textarea') {
      this.input.style.height = 'auto';
      this.input.style.height = this.input.scrollHeight + 'px';
    }
    this.reportValidity();
    redispatchEvent(this, event);
  }

  select() {
    this.input.select();
  }

  reset() {
    this.dirty = false;
    this.value = this.getAttribute('value') ?? '';
    this.nativeError = false;
    this.nativeErrorText = '';
  }

  setRangeText(replacement: string): void;
  setRangeText(
    replacement: string,
    start: number,
    end: number,
    selectionMode?: SelectionMode
  ): void;
  setRangeText(...args: unknown[]) {
    this.input!.setRangeText(
      ...(args as Parameters<HTMLInputElement['setRangeText']>)
    );
    this.value = this.input.value;
  }

  stepDown(stepDecrement?: number) {
    if (this.input instanceof HTMLTextAreaElement) {
      return;
    }

    this.input.stepDown(stepDecrement);
    this.value = this.input.value;
  }

  stepUp(stepIncrement?: number) {
    if (this.input instanceof HTMLTextAreaElement) {
      return;
    }

    this.input.stepUp(stepIncrement);
    this.value = this.input.value;
  }

  override attributeChangedCallback(
    attribute: string,
    newValue: string | null,
    oldValue: string | null
  ) {
    if (attribute === 'value' && this.dirty) {
      // After user input, changing the value attribute no longer updates the
      // text field's value (until reset). This matches native <input> behavior.
      return;
    }

    super.attributeChangedCallback(attribute, newValue, oldValue);
  }

  protected override updated() {
    const value = this.input.value;
    if (this.value !== value) {
      this.value = value;
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

  override focus() {
    if (this.focused) {
      return;
    }
    this.input.focus();
  }

  [createValidator](): Validator<unknown> {
    return new TextFieldValidator(() => ({
      state: this,
      renderedControl: this.input,
    }));
  }

  [getValidityAnchor](): HTMLElement | null {
    return this.input;
  }

  [onReportValidity](invalidEvent: Event | null) {
    invalidEvent?.preventDefault();
    this.nativeError = !!invalidEvent;
    this.nativeErrorText = this.validationMessage;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-text-field': MdTextFieldElement;
  }
}
