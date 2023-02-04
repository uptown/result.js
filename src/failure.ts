

export default class Failure<ExplicitErrorType extends Error = Error> {
  public readonly exception: ExplicitErrorType | Error;

  private constructor(exception: ExplicitErrorType | Error) {
    this.exception = exception;
  }

  toString(): string {
    return `Failure(${this.exception})`;
  }

  static createFailure<ExplicitErrorType extends Error = Error>(exception: ExplicitErrorType | Error): Failure<ExplicitErrorType> {
    return new Failure(exception);
  }
}
