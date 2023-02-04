export interface SuccessResult<T, ExplicitErrorType extends Error = Error> {
  isSuccess(): this is SuccessResult<T, ExplicitErrorType>;

  isFailure(): this is FailureResult<T, ExplicitErrorType>;

  exception(): never

  exceptionOrNull(): null

  getOrThrow(): T;

  getOrElse<R extends T>(onFailure: (exception: Error) => R): R;

  getOrNull(): T;

  throwOnFailure(): void;

  toString(): string;
}

export interface FailureResult<T, ExplicitErrorType extends Error = Error> {
  isSuccess(): this is SuccessResult<T>;

  isFailure(): this is FailureResult<T, ExplicitErrorType>;

  exception(): ExplicitErrorType | Error

  exceptionOrNull(): ExplicitErrorType | Error

  getOrThrow(): never;

  getOrElse<R extends T>(onFailure: (exception: Error) => R): R;

  getOrNull(): null;

  throwOnFailure(): never;

  toString(): string;
}

