import { EMPTY, Observable, catchError, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { handleFormValidationError } from '../../forms/handle-form-validation';

export function catchFormValidationError<T>(formGroup: FormGroup, whenError?: (error: T) => boolean | void) {
  return (source: Observable<T>) =>
    source.pipe(
      catchError((error) => {
        if (whenError?.(error)) {
          return EMPTY;
        }
        const handled = handleFormValidationError(formGroup, error);
        if (handled) {
          return EMPTY;
        }
        return throwError(() => error);
      })
    );
}
