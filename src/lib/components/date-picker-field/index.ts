import { html, LitElement, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styles } from './styles';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  tap,
} from 'rxjs';
import { observe, property$ } from '../../common';
import { FieldVariant, MdFieldElement } from '../field';
import { MdDatePickerElement } from '../date-picker';
import { ifDefined } from 'lit/directives/if-defined.js';
import { getDateTimeFormatOptions } from '../../common/helpers/format-date';

@customElement('md-date-picker-field')
export class MdDatePickerFieldElement extends LitElement {
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
  @property$()
  value = '';
  value$!: Observable<string>;

  @property({ type: String })
  selectedValue = this.value;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  locale = 'en';

  @property({ type: String })
  min: string | null = null;

  @property({ type: String })
  max: string | null = null;

  @property({ type: String })
  format = 'dd MMM yyyy';

  @property({ type: String, attribute: 'clear-text' })
  clearText = 'Clear';

  @property({ type: String, attribute: 'okay-text' })
  okayText = 'Okay';

  @property({ type: String, attribute: 'cancel-text' })
  cancelText = 'Cancel';

  @query('md-field')
  private _field!: MdFieldElement;

  private readonly _focused$ = new BehaviorSubject(false);
  private readonly _open$ = new BehaviorSubject(false);

  private readonly _populated$ = combineLatest({
    focused: this._focused$,
    value: this.value$,
    open: this._open$,
  }).pipe(map(({ focused, value, open }) => focused || !!value || open));

  get valueAsDate() {
    if (!this.value) {
      return null;
    }
    return new Date(this.value);
  }
  set valueAsDate(date: Date | null) {
    if (!date) {
      this.value = '';
    } else {
      this.value = date.toISOString();
    }
  }

  get selectedValueAsDate() {
    if (!this.selectedValue) {
      return new Date();
    }
    return new Date(this.selectedValue);
  }
  set selectedValueAsDate(date: Date) {
    this.selectedValue = date.toISOString();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.value$
      .pipe(
        distinctUntilChanged(),
        tap(() => this.dispatchEvent(new Event('change')))
      )
      .subscribe();
  }

  override render() {
    const formattedDate = this.valueAsDate
      ? this.valueAsDate.toLocaleDateString(
          this.locale,
          getDateTimeFormatOptions(this.format)
        )
      : '';
    return html`<md-field
      variant=${this.variant}
      ?populated=${observe(this._populated$)}
      supporting-text=${ifDefined(this.supportingText)}
      error-text=${ifDefined(this.errorText)}
      label=${ifDefined(this.label)}
      ?disabled=${this.disabled}
      @body-click=${() => this._field.openPopover()}
      @open=${() => this._open$.next(true)}
      @close=${() => this._open$.next(false)}
    >
    <slot name="leading" slot="leading"></slot>
    <md-icon slot="trailing">arrow_drop_down</md-icon>
    ${formattedDate}
      <md-date-picker
        value=${this.selectedValue}
        slot="popover"
        @change=${this.handleChange}
        locale=${this.locale}
        min=${this.min}
        max=${this.max}
      ></md-date-picker>
      <div slot="popover" class="actions">
      <md-button
          variant="text"
          @click=${this.clearClick}
          style="margin-inline-end: auto"
          >${this.clearText}</md-button
        >
        <md-button
          variant="text"
          @click=${this.okayClick}
          ?disabled=${this.value === this.selectedValue}
          >${this.okayText}</md-button
        >
        <md-button variant="text" @click=${this.cancelClick}>${this.cancelText}</md-button>
      </div>
    </md-field>`;
  }

  private okayClick() {
    this.value = this.selectedValue;
    this._field.closePopover();
  }

  private cancelClick() {
    this.selectedValue = this.value;
    this._field.closePopover();
  }

  private clearClick() {
    this.selectedValue = '';
  }

  private handleChange(event: Event) {
    this.selectedValue = (event.target as MdDatePickerElement).value;
  }

  override focus(): void {
    this._focused$.next(true);
  }

  override blur(): void {
    this._focused$.next(false);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-date-picker-field': MdDatePickerFieldElement;
  }
}
