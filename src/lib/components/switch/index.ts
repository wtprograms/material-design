import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
  queryAssignedNodes,
} from 'lit/decorators.js';
import { styles } from './styles';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { property$ } from '../../common/lit/property$.decorator';
import { mixinStringValue, mixinFormAssociated, mixinElementInternals, CheckboxValidator, getFormState, getFormValue } from '../../common';
import { createValidator, getValidityAnchor, mixinConstraintValidation } from '../../common/mixins/mixin-constraint-validation';

const base = mixinStringValue(
  mixinConstraintValidation(
    mixinFormAssociated(mixinElementInternals(LitElement))
  ),
  'on'
);
@customElement('md-switch')
export class MdSwitchElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  @property$()
  checked = false;
  checked$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: Boolean, reflect: true })
  label = false;

  @queryAssignedNodes()
  private readonly _slotElements!: NodeListOf<HTMLElement>;

  @queryAssignedElements({ slot: 'unchecked-icon' })
  private _uncheckedIconElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'checked-icon' })
  private _checkedIconElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true, attribute: 'unchecked-icon' })
  uncheckedIcon = false;

  @property({ type: Boolean, reflect: true, attribute: 'checked-icon' })
  checkedIcon = false;

  @property({ type: Boolean })
  required = false;

  @query('input')
  private readonly _input!: HTMLInputElement;

  override render() {
    return html`<div class="track">
        <div class="container">
          <md-ripple for="control" interactive></md-ripple>
          <md-focus-ring for="control" focus-visible></md-focus-ring>
          <div class="handle">
            <span class="unchecked-icon">
              <slot
                name="unchecked-icon"
                @slotchange=${() =>
                  (this.uncheckedIcon = !!this._uncheckedIconElements.length)}
              ></slot>
            </span>
            <span class="checked-icon">
              <slot
                name="checked-icon"
                @slotchange=${() =>
                  (this.checkedIcon = !!this._checkedIconElements.length)}
              ></slot>
            </span>
          </div>
        </div>
      </div>
      <input
        id="control"
        type="checkbox"
        ?disabled="${this.disabled}"
        ?required=${this.required}
        .checked="${this.checked}"
        @input=${this.onInput}
        @change=${this.onChange}
      />
      <span class="label"
        ><slot
          @slotchange=${() => (this.label = !!this._slotElements.length)}
        ></slot
      ></span>`;
  }

  private onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
  }

  private onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.checked === this.checked) {
      return;
    }
    this.checked = input?.checked ?? false;
  }

  override [getFormValue]() {
    if (!this.checked) {
      return null;
    }

    return this.value;
  }

  override [getFormState]() {
    return String(this.checked);
  }

  override formResetCallback() {
    // The checked property does not reflect, so the original attribute set by
    // the user is used to determine the default value.
    this.checked = this.hasAttribute('checked');
  }

  override formStateRestoreCallback(state: string) {
    this.checked = state === 'true';
  }

  override [createValidator]() {
    return new CheckboxValidator(() => this);
  }

  override [getValidityAnchor]() {
    return this._input;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-switch': MdSwitchElement;
  }
}
