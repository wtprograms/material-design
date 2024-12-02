export class InvalidArgumentError extends Error {
  constructor(
    public readonly argumentName: string,
    public readonly argumentValue: unknown,
    message = `Argument '${argumentName}' with value '${argumentValue} is invalid.`
  ) {
    super(message);
  }
}
