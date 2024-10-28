import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { ValidationError } from '../errors/validation.error';

export type ModelState = Record<string, string[] | string>;

export function handleFormValidationError(formGroup: FormGroup, error: HttpErrorResponse | ValidationError | ModelState) {
  if (error instanceof HttpErrorResponse && error.status === 400) {
    updateFormGroupErrors(
      formGroup,
      error.error as ModelState
    );
    return true;
  } else if (error instanceof ValidationError) {
    updateFormGroupErrors(formGroup, {
      [error.field]: [error.message],
    });
    return true;
  } else if (isModelState(error)) {
    updateFormGroupErrors(formGroup, error);
    return true;
  }
  return false;
}

function updateFormGroupErrors(formGroup: FormGroup, modelState: ModelState) {
  for (const [key, value] of Object.entries(modelState)) {
    const control = formGroup.get(key);
    if (control) {
      const errorMessage = typeof value === 'string' ? value : value[0];
      control.setErrors({ custom: errorMessage }, { emitEvent: true });
      control.markAsDirty();
      control.markAsTouched();
      (control as any).invalidate?.();
    }
  }
}

function isModelState(error: HttpErrorResponse | ValidationError | ModelState): error is ModelState {
  return !(error instanceof HttpErrorResponse || error instanceof ValidationError);
}