import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styles } from './styles';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { getFormState, getFormValue, mixinElementInternals, mixinFormAssociated, mixinStringValue, ObservableElement, observe, TimeSpan } from '../../common';
import { MdFieldElement } from '../field';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MdTimePickerElement } from '../time-picker';
import { mixinField } from '../../common/mixins/mixin-field';

const base = mixinField(mixinStringValue(mixinFormAssociated(mixinElementInternals(ObservableElement))));

@customElement('md-time-picker-field')
export class MdTimePickerFieldElement extends base {
  static override styles = [styles];

  @property({ type: String, attribute: 'selected-value' })
  selectedValue = this.value;

  @property({ type: Boolean })
  seconds = false;

  @property({ type: String, attribute: 'reset-text' })
  resetText = 'Reset';

  @property({ type: String, attribute: 'okay-text' })
  okayText = 'Okay';

  @property({ type: String, attribute: 'cancel-text' })
  cancelText = 'Cancel';

  @property({ type: String })
  min: string | null = null;

  @property({ type: String })
  max: string | null = null;

  @property({ type: Boolean, attribute: 'time-of-day' })
  timeOfDay = false;

  @property({ type: String })
  locale = 'en';

  get valueAsTimeSpan() {
    if (!this.value) {
      return new TimeSpan();
    }
    return TimeSpan.parse(this.value);
  }
  set valueAsTimeSpan(value: TimeSpan) {
    this.value = value.toString();
  }

  get selectedValueAsTimeSpan() {
    return this.selectedValue ? TimeSpan.parse(this.selectedValue) : null;
  }
  set selectedValueAsTimeSpan(value: TimeSpan | null | undefined) {
    this.selectedValue = value?.toString() ?? '';
  }

  get valueAsTimeOfDay() {
    const date = new Date();
    const timeSpan = this.valueAsTimeSpan;
    date.setHours(timeSpan.hours);
    date.setMinutes(timeSpan.minutes);
    date.setSeconds(timeSpan.seconds);
    return date;
  }
  set valueAsTimeOfDay(value: Date) {
    const timeSpan = new TimeSpan(
      value.getHours(),
      value.getMinutes(),
      value.getSeconds()
    );
    this.valueAsTimeSpan = timeSpan;
  }

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
    const value = this.timeOfDay
      ? this.valueAsTimeOfDay.toFormattedTimeString(this.locale, this.seconds ? 'hh mm ss' : 'hh mm')
      : this.valueAsTimeSpan.toString();
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
      @opening=${() => this._opening$.next(true)}
      @closing=${() => this._opening$.next(false)}
    >
      ${value}
      <slot name="leading" slot="leading"></slot>
      <md-icon slot="trailing">arrow_drop_down</md-icon>
      <md-time-picker
        value=${this.selectedValue}
        slot="popover"
        @change=${this.handleChange}
        locale=${this.locale}
        min=${this.min}
        max=${this.max}
        ?time-of-day=${this.timeOfDay}
      ></md-time-picker>
      <div slot="popover" class="actions">
        <md-button
          variant="text"
          @click=${this.clearClick}
          style="margin-inline-end: auto"
          >${this.resetText}</md-button
        >
        <md-button
          variant="text"
          @click=${this.okayClick}
          ?disabled=${this.value === this.selectedValue}
          >${this.okayText}</md-button
        >
        <md-button variant="text" @click=${this.cancelClick}
          >${this.cancelText}</md-button
        >
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

  override [getFormValue]() {
    return this.value || null;
  }

  override [getFormState]() {
    return this.value;
  }

  override formResetCallback() {
    this.value = '';
  }

  override formStateRestoreCallback(state: string) {
    this.value = state;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-time-picker-field': MdTimePickerFieldElement;
  }
}
