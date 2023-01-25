export interface SuccessResult<T> {
  isSuccess(): this is SuccessResult<T>;

  isFailure(): this is FailureResult<T>;

  exception(): never

  exceptionOrNull(): null

  getOrThrow(): T;

  getOrElse<R extends T>(onFailure: (exception: Error) => R): R;

  getOrNull(): T;

  throwOnFailure(): void;

  toString(): string;
}

export interface FailureResult<T> {
  isSuccess(): this is SuccessResult<T>;

  isFailure(): this is FailureResult<T>;

  exception(): Error

  exceptionOrNull(): Error

  getOrThrow(): never;

  getOrElse<R extends T>(onFailure: (exception: Error) => R): R;

  getOrNull(): null;

  throwOnFailure(): never;

  toString(): string;
}

export type ResultUnknown<T> = (SuccessResult<T> | FailureResult<T>)

export type PromiseResult<T> = Promise<ResultUnknown<T>>
// https://github.com/Microsoft/TypeScript/issues/12776
export const PromiseResult = Promise