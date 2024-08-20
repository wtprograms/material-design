import { assertDefined } from './assert-defined';

export function defined<T>(
  value: T | null | undefined,
  message?: string
): NonNullable<T> {
  assertDefined(value, message);
  return value;
}
