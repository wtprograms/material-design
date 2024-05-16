export class InvalidAttributeError extends Error {
  constructor(public attribute: string, public value: unknown, message: string) {
    super(message);
    this.name = 'InvalidAttributeError';
  }
}