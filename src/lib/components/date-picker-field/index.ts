import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styles } from './styles';
import {
  BehaviorSubject,
  combineLatest,
  map,
} from 'rxjs';
import { mixinStringValue, observe } from '../../common';
import { MdFieldElement } from '../field';
import { MdDatePickerElement } from '../date-picker';
import { ifDefined } from 'lit/directives/if-defined.js';
import { mixinField } from '../../common/mixins/mixin-field';

const base = mixinStringValue(mixinField(LitElement));

@customElement('md-date-picker-field')
export class MdDatePickerFieldElement extends base {
  static override styles = [styles];

  @property({ type: String })
  selectedValue = this.value;

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

  @property({ type: String, attribute: 'today-text' })
  todayText = 'Today';

  get valueAsDate() {
    return Date.parseString(this.value) ?? null;
  }
  set valueAsDate(value: Date | null | undefined) {
    this.value = value?.toString() ?? null;
  }

  get selectedValueAsDate() {
    return Date.parseString(this.selectedValue) ?? null;
  }
  set selectedValueAsDate(value: Date | null | undefined) {
    this.selectedValue = value?.toString() ?? null;
  }

  @query('md-date-picker')
  private _datePicker!: MdDatePickerElement;

  @query('md-field')
  private _field!: MdFieldElement;

  private readonly _focused$ = new BehaviorSubject(false);
  private readonly _open$ = new BehaviorSubject(false);
  private readonly _opening$ = new BehaviorSubject(false);

  private readonly _populated$ = combineLatest({
    focused: this._focused$,
    value: this.value$,
    open: this._open$,
    opening: this._opening$,
  }).pipe(map((x) => x.focused || !!x.value || x.opening));

  override render() {
    const formattedDate = Date.parseString(this.selectedValue, new Date()).toFormattedDateString(this.locale, this.format);
    return html`<md-field
      variant=${this.variant}
      ?populated=${observe(this._populated$)}
      supporting-text=${ifDefined(this.supportingText)}
      error-text=${ifDefined(this.errorText)}
      label=${ifDefined(this.label)}
      ?disabled=${this.disabled}
      today-text=${this.todayText}
      @body-click=${() => this._field.openPopover()}
      @open=${() => this._open$.next(true)}
      @opening=${() => this._opening$.next(true)}
      @close=${() => this._open$.next(false)}
      @closing=${() => this._opening$.next(false)}
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
    this._datePicker.viewValue = this.selectedValue;
    this._field.closePopover();
  }

  private cancelClick() {
    this.selectedValue = this.value;
    this._datePicker.viewValue = this.value;
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
