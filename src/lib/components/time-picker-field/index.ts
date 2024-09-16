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
import { mixinValueElement, observe, property$ } from '../../common';
import { FieldVariant, MdFieldElement } from '../field';
import { MdDatePickerElement } from '../date-picker';
import { ifDefined } from 'lit/directives/if-defined.js';
import { getDateTimeFormatOptions } from '../../common/helpers/date/get-date-time-format-options';
import { MdTimePickerElement } from '../time-picker';

const base = mixinValueElement(LitElement);

@customElement('md-time-picker-field')
export class MdTimePickerFieldElement extends base {
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
  selectedValue = this.value;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  locale = 'en';

  @property({ type: String })
  min: string | null = null;

  @property({ type: String })
  max: string | null = null;

  @property({ type: Boolean })
  seconds = false;

  @property({ type: String })
  format = this.seconds ? 'hh mm ss' : 'hh mm';

  @property({ type: String, attribute: 'now-text' })
  nowText = 'Now';

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

  override render() {
    const formattedDate = Date.parseString(this.value, new Date()).toFormattedTimeString(this.locale, this.format);
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
      <md-time-picker
        value=${this.selectedValue}
        slot="popover"
        @change=${this.handleChange}
        locale=${this.locale}
        min=${this.min}
        max=${this.max}
      ></md-time-picker>
      <div slot="popover" class="actions">
      <md-button
          variant="text"
          @click=${this.clearClick}
          style="margin-inline-end: auto"
          >${this.nowText}</md-button
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
    this.selectedValue = (event.target as MdTimePickerElement).value;
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
    'md-time-picker-field': MdTimePickerFieldElement;
  }
}
