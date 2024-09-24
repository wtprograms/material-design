import {Validator} from './validator.js';

export interface CheckboxState {
  readonly checked: boolean;
  readonly required: boolean;
}

export class CheckboxValidator extends Validator<CheckboxState> {
  private checkboxControl?: HTMLInputElement;

  protected override computeValidity(state: CheckboxState) {
    if (!this.checkboxControl) {
      // Lazily create the platform input
      this.checkboxControl = document.createElement('input');
      this.checkboxControl.type = 'checkbox';
    }

    this.checkboxControl.checked = state.checked;
    this.checkboxControl.required = state.required;
    return {
      validity: this.checkboxControl.validity,
      validationMessage: this.checkboxControl.validationMessage,
    };
  }

  protected override equals(prev: CheckboxState, next: CheckboxState) {
    return prev.checked === next.checked && prev.required === next.required;
  }

  protected override copy({checked, required}: CheckboxState) {
    return {checked, required};
  }
}
