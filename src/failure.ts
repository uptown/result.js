

export default class Failure {
  public readonly exception: Error;

  private constructor(exception: Error) {
    this.exception = exception;
  }

  toString(): string {
    return `Failure(${this.exception})`;
  }

  static createFailure(exception: Error): Failure {
    return new Failure(exception);
  }
}
