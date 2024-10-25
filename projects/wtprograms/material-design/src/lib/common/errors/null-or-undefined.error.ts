export class NullOrUndefinedError extends Error {
  constructor(public readonly value: unknown, message = 'Value is null or undefined') {
    super(message);
  }
}