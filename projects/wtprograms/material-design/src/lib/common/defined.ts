import { NullOrUndefinedError } from './errors/null-or-undefined.error';

export class Defined {
  static isNotNull<T>(value: T | null | undefined): value is NonNullable<T> {
    return value !== undefined && value !== null;
  }

  static assert<T>(value: T, errorMessage?: string): asserts value is NonNullable<T> {
    if (!this.isNotNull(value)) {
      throw new NullOrUndefinedError(value, errorMessage);
    }
  }

  static definedValue<T>(value: T | null | undefined, errorMessage?: string): NonNullable<T> {
    this.assert(value, errorMessage);
    return value;
  }
}