import { NullOrUndefinedError } from '../errors/null-or-undefined.error';
import { isDefined } from './is-defined';

export function assertDefined<T>(value: T, errorMessage?: string): asserts value is NonNullable<T> {
  if (!isDefined(value)) {
    throw new NullOrUndefinedError(value, errorMessage);
  }
}