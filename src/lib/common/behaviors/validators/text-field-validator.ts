import {Validator} from './validator.js';

export interface TextFieldState {
  state: InputState | TextAreaState;
  renderedControl: HTMLInputElement | HTMLTextAreaElement | null;
}

export interface InputState extends SharedInputAndTextAreaState {
  readonly type: string;
  readonly pattern: string;
  readonly min: string;
  readonly max: string;
}

export interface TextAreaState extends SharedInputAndTextAreaState {
  readonly type: 'textarea';
}

interface SharedInputAndTextAreaState {
  readonly value: string;
  readonly required: boolean;
  readonly minLength: number;
  readonly maxLength: number;
}

export class TextFieldValidator extends Validator<TextFieldState> {
  private inputControl?: HTMLInputElement;
  private textAreaControl?: HTMLTextAreaElement;

  protected override computeValidity({state, renderedControl}: TextFieldState) {
    let inputOrTextArea = renderedControl;
    if (isInputState(state) && !inputOrTextArea) {
      // Get cached <input> or create it.
      inputOrTextArea = this.inputControl || document.createElement('input');
      // Cache the <input> to re-use it next time.
      this.inputControl = inputOrTextArea;
    } else if (!inputOrTextArea) {
      // Get cached <textarea> or create it.
      inputOrTextArea =
        this.textAreaControl || document.createElement('textarea');
      // Cache the <textarea> to re-use it next time.
      this.textAreaControl = inputOrTextArea;
    }

    // Set this variable so we can check it for input-specific properties.
    const input = isInputState(state)
      ? (inputOrTextArea as HTMLInputElement)
      : null;

    // Set input's "type" first, since this can change the other properties
    if (input) {
      input.type = state.type;
    }

    if (inputOrTextArea.value !== state.value) {
      // Only programmatically set the value if there's a difference. When using
      // the rendered control, the value will always be up to date. Setting the
      // property (even if it's the same string) will reset the internal <input>
      // dirty flag, making minlength and maxlength validation reset.
      inputOrTextArea.value = state.value ?? '';
    }

    inputOrTextArea.required = state.required;

    // The following IDLAttribute properties will always hydrate an attribute,
    // even if set to a the default value ('' or -1). The presence of the
    // attribute triggers constraint validation, so we must remove the attribute
    // when empty.
    if (input) {
      const inputState = state as InputState;
      if (inputState.pattern) {
        input.pattern = inputState.pattern;
      } else {
        input.removeAttribute('pattern');
      }

      if (inputState.min) {
        input.min = inputState.min;
      } else {
        input.removeAttribute('min');
      }

      if (inputState.max) {
        input.max = inputState.max;
      } else {
        input.removeAttribute('max');
      }
    }

    // Use -1 to represent no minlength and maxlength, which is what the
    // platform input returns. However, it will throw an error if you try to
    // manually set it to -1.
    //
    // While the type is `number`, it may actually be `null` at runtime.
    // `null > -1` is true since `null` coerces to `0`, so we default null and
    // undefined to -1.
    //
    // We set attributes instead of properties since setting a property may
    // throw an out of bounds error in relation to the other property.
    // Attributes will not throw errors while the state is updating.
    if ((state.minLength ?? -1) > -1) {
      inputOrTextArea.setAttribute('minlength', String(state.minLength));
    } else {
      inputOrTextArea.removeAttribute('minlength');
    }

    if ((state.maxLength ?? -1) > -1) {
      inputOrTextArea.setAttribute('maxlength', String(state.maxLength));
    } else {
      inputOrTextArea.removeAttribute('maxlength');
    }

    return {
      validity: inputOrTextArea.validity,
      validationMessage: inputOrTextArea.validationMessage,
    };
  }

  protected override equals(
    {state: prev}: TextFieldState,
    {state: next}: TextFieldState,
  ) {
    // Check shared input and textarea properties
    const inputOrTextAreaEqual =
      prev.type === next.type &&
      prev.value === next.value &&
      prev.required === next.required &&
      prev.minLength === next.minLength &&
      prev.maxLength === next.maxLength;

    if (!isInputState(prev) || !isInputState(next)) {
      // Both are textareas, all relevant properties are equal.
      return inputOrTextAreaEqual;
    }

    // Check additional input-specific properties.
    return (
      inputOrTextAreaEqual &&
      prev.pattern === next.pattern &&
      prev.min === next.min &&
      prev.max === next.max
    );
  }

  protected override copy({state}: TextFieldState): TextFieldState {
    // Don't hold a reference to the rendered control when copying since we
    // don't use it when checking if the state changed.
    return {
      state: isInputState(state)
        ? this.copyInput(state)
        : this.copyTextArea(state),
      renderedControl: null,
    };
  }

  private copyInput(state: InputState): InputState {
    const {type, pattern, min, max} = state;
    return {
      ...this.copySharedState(state),
      type,
      pattern,
      min,
      max,
    };
  }

  private copyTextArea(state: TextAreaState): TextAreaState {
    return {
      ...this.copySharedState(state),
      type: state.type,
    };
  }

  private copySharedState({
    value,
    required,
    minLength,
    maxLength,
  }: SharedInputAndTextAreaState): SharedInputAndTextAreaState {
    return {value, required, minLength, maxLength};
  }
}

function isInputState(state: InputState | TextAreaState): state is InputState {
  return state.type !== 'textarea';
}
