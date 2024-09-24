export abstract class Validator<State> {
  private prevState?: State;
  private currentValidity: ValidityAndMessage = {
    validity: {},
    validationMessage: '',
  };

  constructor(private readonly getCurrentState: () => State) {}

  getValidity(): ValidityAndMessage {
    const state = this.getCurrentState();
    const hasStateChanged =
      !this.prevState || !this.equals(this.prevState, state);
    if (!hasStateChanged) {
      return this.currentValidity;
    }

    const {validity, validationMessage} = this.computeValidity(state);
    this.prevState = this.copy(state);
    this.currentValidity = {
      validationMessage,
      validity: {
        // Change any `ValidityState` instances into `ValidityStateFlags` since
        // `ValidityState` cannot be easily `{...spread}`.
        badInput: validity.badInput,
        customError: validity.customError,
        patternMismatch: validity.patternMismatch,
        rangeOverflow: validity.rangeOverflow,
        rangeUnderflow: validity.rangeUnderflow,
        stepMismatch: validity.stepMismatch,
        tooLong: validity.tooLong,
        tooShort: validity.tooShort,
        typeMismatch: validity.typeMismatch,
        valueMissing: validity.valueMissing,
      },
    };

    return this.currentValidity;
  }

  protected abstract computeValidity(state: State): ValidityAndMessage;

  protected abstract equals(prev: State, next: State): boolean;

  protected abstract copy(state: State): State;
}

export interface ValidityAndMessage {
  validity: ValidityStateFlags;
  validationMessage: string;
}
