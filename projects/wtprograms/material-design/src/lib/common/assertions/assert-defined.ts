import { NullOrUndefinedError } from '../errors/null-or-undefined.error';
import { isDefined } from './is-defined';

export function assertDefined<T>(value: unknown): asserts value is T {
  if (!isDefined(value)) {
    throw new NullOrUndefinedError(value);
  }
}