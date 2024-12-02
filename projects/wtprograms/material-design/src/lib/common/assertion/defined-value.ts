import { assertValue } from './assert-value';

export function definedValue<T>(
  value: T | null | undefined,
  message?: string
): T {
  assertValue(value, message);
  return value;
}
