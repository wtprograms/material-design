import { NullOrUndefinedError } from '../errors/null-or-undefined.error';

export function assertValue<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new NullOrUndefinedError(value, message);
  }
}
