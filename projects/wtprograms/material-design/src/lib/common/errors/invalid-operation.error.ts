export class InvalidOperationError extends Error {
  constructor(message = 'Invalid operation.') {
    super(message);
  }
}