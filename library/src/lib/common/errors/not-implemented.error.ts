export class NotImplementedError extends Error {
  constructor(message?: string) {
    super(message ?? 'This feature is not yet implemented.');
    this.name = 'NotImplementedError';
  }
}