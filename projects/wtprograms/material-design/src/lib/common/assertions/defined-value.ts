import { assertDefined } from './assert-defined';

export function definedValue<T>(value: T | null | undefined, errorMessage?: string): NonNullable<T> {
  assertDefined(value, errorMessage);
  return value;
}