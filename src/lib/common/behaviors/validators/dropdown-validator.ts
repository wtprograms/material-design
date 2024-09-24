import {html, render} from 'lit';

import {Validator} from './validator.js';

export interface DropdownState {
  readonly value: string;
  readonly required: boolean;
}

export class DropdownValidator extends Validator<DropdownState> {
  private selectControl?: HTMLSelectElement;

  protected override computeValidity(state: DropdownState) {
    if (!this.selectControl) {
      // Lazily create the platform select
      this.selectControl = document.createElement('select');
    }

    render(html`<option value=${state.value}></option>`, this.selectControl);

    this.selectControl.value = state.value;
    this.selectControl.required = state.required;
    return {
      validity: this.selectControl.validity,
      validationMessage: this.selectControl.validationMessage,
    };
  }

  protected override equals(prev: DropdownState, next: DropdownState) {
    return prev.value === next.value && prev.required === next.required;
  }

  protected override copy({value, required}: DropdownState) {
    return {value, required};
  }
}
