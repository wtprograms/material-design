import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedNodes,
} from 'lit/decorators.js';
import { styles } from './styles';
import { combineLatest, map, Observable } from 'rxjs';
import { observe } from '../../common/lit/observe-directive';
import {
  CheckboxValidator,
  getFormState,
  getFormValue,
  mixinElementInternals,
  mixinFormAssociated,
  mixinParentActivation,
  mixinStringValue,
  ObservableElement,
  redispatchEvent,
} from '../../common';
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '../../common/mixins/mixin-constraint-validation';
import { live } from 'lit/directives/live.js';

const base = mixinParentActivation(
  mixinStringValue(
    mixinConstraintValidation(
      mixinFormAssociated(mixinElementInternals(ObservableElement))
    ),
    'on'
  )
);

@customElement('md-check-box')
export class MdCheckBoxElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  indeterminate = false;
  indeterminate$!: Observable<boolean>;

  @property({ type: Boolean, reflect: true })
  label = false;

  @property({ type: Boolean, reflect: true })
  checked = false;
  checked$!: Observable<boolean>;

  @property({ type: Boolean })
  required = false;

  @query('input')
  private readonly _input!: HTMLInputElement;

  @property({ type: Boolean, reflect: true })
  error = false;

  @queryAssignedNodes()
  private readonly _slotElements!: NodeListOf<HTMLElement>;

  private readonly _icon$ = combineLatest({
    checked: this.checked$,
    indeterminate: this.indeterminate$,
  }).pipe(
    map(({ checked, indeterminate }) => {
      if (!checked) {
        return 'check_box_outline_blank';
      } else if (checked && !indeterminate) {
        return 'check_box';
      }
      return 'indeterminate_check_box';
    })
  );

  override render() {
    return html`<div class="container">
        <md-ripple for="control" interactive></md-ripple>
        <md-focus-ring for="control" focus-visible></md-focus-ring>
        <md-icon ?filled="${this.checked}">${observe(this._icon$)}</md-icon>
      </div>
      <input
        id="control"
        type="checkbox"
        ?disabled="${this.disabled}"
        ?required=${this.required}
        .checked="${live(this.checked)}"
        @input=${this.onInput}
        @change=${this.onChange}
        .indeterminate=${this.indeterminate}
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
    this.indeterminate = target.indeterminate;
  }

  private onChange(event: Event) {
    redispatchEvent(this, event);
  }

  override [getFormValue]() {
    if (!this.checked || this.indeterminate) {
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
    'md-check-box': MdCheckBoxElement;
  }
}
