export class NullOrUndefinedError extends Error {
  constructor(message?: string, public value?: unknown) {
    super(message);
    this.name = 'NullOrUndefinedError';
  }
}
