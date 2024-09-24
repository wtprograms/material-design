import { html, isServer, LitElement } from 'lit';
import { customElement, property, query, queryAssignedNodes } from 'lit/decorators.js';
import { styles } from './styles';
import { BehaviorSubject, map } from 'rxjs';
import { observe } from '../../common/lit/observable-directive';
import {
  getFormState,
  getFormValue,
  internals,
  isActivationClick,
  mixinElementInternals,
  mixinFormAssociated,
  mixinStringValue,
  RadioValidator,
} from '../../common';
import { createValidator, getValidityAnchor, mixinConstraintValidation } from '../../common/mixins/mixin-constraint-validation';
import { SingleSelectionController } from './single-selection-controller';

const CHECKED = Symbol('checked');
let maskId = 0;

const base = mixinStringValue(
  mixinConstraintValidation(
    mixinFormAssociated(mixinElementInternals(LitElement))
  ),
  'on'
);

@customElement('md-radio-button')
export class MdRadioButtonElement extends base {
  static override styles = [styles];

  @property({ type: Boolean, reflect: true })
  error = false;

  @property({ type: Boolean, reflect: true })
  label = false;

  @queryAssignedNodes()
  private readonly _slotElements!: NodeListOf<HTMLElement>;

  @property({ type: Boolean, reflect: true })
  get checked() {
    return this[CHECKED];
  }
  set checked(checked: boolean) {
    const wasChecked = this.checked;
    if (wasChecked === checked) {
      return;
    }

    this[CHECKED] = checked;
    this.requestUpdate('checked', wasChecked);
    this.selectionController.handleCheckedChange();
    this.checked$.next(checked);
  }
  checked$ = new BehaviorSubject<boolean>(this.checked);

  @property({ type: Boolean })
  required = false;

  @query('input')
  private readonly _input!: HTMLInputElement;

  private readonly _icon$ = this.checked$.pipe(
    map((checked) =>
      checked ? 'radio_button_checked' : 'radio_button_unchecked'
    )
  );

  [CHECKED] = false;
  private readonly selectionController = new SingleSelectionController(this);
  private readonly maskId = `cutout${++maskId}`;

  constructor() {
    super();
    if (!isServer) {
      this[internals].role = 'radio';
      this.addEventListener('click', this.handleClick.bind(this));
      this.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }

  override render() {
    return html`<div class="container">
        <md-ripple for="control" interactive></md-ripple>
        <md-focus-ring for="control" focus-visible></md-focus-ring>
        <md-icon ?filled="${this.checked}">${observe(this._icon$)}</md-icon>
      </div>
      <input
        id="control"
        type="radio"
        ?disabled="${this.disabled}"
        .checked="${this.checked}"
        tabindex="1"
        .value=${this.value}
      />
      <span class="label"
        ><slot
          @slotchange=${() => (this.label = !!this._slotElements.length)}
        ></slot
      ></span>`;
  }

  private async handleClick(event: Event) {
    if (this.disabled) {
      return;
    }

    // allow event to propagate to user code after a microtask.
    await 0;
    if (event.defaultPrevented) {
      return;
    }

    if (isActivationClick(event)) {
      this.focus();
    }

    // Per spec, clicking on a radio input always selects it.
    this.checked = true;
    this.dispatchEvent(new Event('change', {bubbles: true}));
    this.dispatchEvent(
      new InputEvent('input', {bubbles: true, composed: true}),
    );
  }

  private async handleKeydown(event: KeyboardEvent) {
    // allow event to propagate to user code after a microtask.
    await 0;
    if (event.key !== ' ' || event.defaultPrevented) {
      return;
    }

    this.click();
  }

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.checked === this.checked) {
      return;
    }
    this.checked = input?.checked ?? false;
  }

  override [getFormValue]() {
    return this.checked ? this.value : null;
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
    return new RadioValidator(() => {
      if (!this.selectionController) {
        // Validation runs on superclass construction, so selection controller
        // might not actually be ready until this class constructs.
        return [this];
      }

      return this.selectionController.controls as [MdRadioButtonElement, ...MdRadioButtonElement[]];
    });
  }

  override [getValidityAnchor]() {
    return this._input;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-radio-button': MdRadioButtonElement;
  }
}
