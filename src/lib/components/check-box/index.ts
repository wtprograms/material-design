import { html, LitElement } from 'lit';
import {
  customElement,
} from 'lit/decorators.js';
import { styles } from './styles';
import { mixinCheck, mixinElementInternals } from '../../common';
import { getFormState, getFormValue, mixinFormAssociated } from '../../common/behaviors/form-associated';
import { createValidator, getValidityAnchor, mixinConstraintValidation } from '../../common/mixins/mixin-constraint-validation';
import { CheckboxValidator } from '../../common/behaviors/validators/checkbox-validator';

const base = mixinConstraintValidation(
  mixinFormAssociated(mixinElementInternals(mixinCheck(LitElement))));

@customElement('md-check-box')
export class MdCheckBoxElement extends base {
  static override styles = [styles];

  /** @nocollapse */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  get icon(): string {
    if (!this.checked) {
      return 'check_box_outline_blank';
    } else if (this.checked && !this.indeterminate) {
      return 'check_box';
    } else {
      return 'indeterminate_check_box';
    }
  }

  protected override render(): unknown {
    return html`<div class="container">
      ${this.renderRipple()}
      ${this.renderFocusRing()}
      <md-icon ?filled=${this.checked}>${this.icon}</md-icon>
    </div>
    ${this.renderInput('checkbox')}
    ${this.renderLabel()}`;
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

  [createValidator]() {
    return new CheckboxValidator(() => this);
  }

  [getValidityAnchor]() {
    return this.inputElement;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-check-box': MdCheckBoxElement;
  }
}
