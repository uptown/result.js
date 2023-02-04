import { FailureResult, SuccessResult } from "./types";
import Failure from "./failure";

export default class Result<T, ExplicitErrorType extends Error = Error> implements SuccessResult<T, ExplicitErrorType>, FailureResult<T, ExplicitErrorType> {
  private readonly value: any;

  private constructor(value: any) {
    this.value = value;
  }

  static success<T, ExplicitErrorType extends Error = Error>(value: T): SuccessResult<T, ExplicitErrorType> {
    return new Result(value) as unknown as SuccessResult<T, ExplicitErrorType>;
  }

  static failure<T, ExplicitErrorType extends Error = Error>(exception: ExplicitErrorType): FailureResult<T, ExplicitErrorType> {
    return new Result(Failure.createFailure(exception)) as unknown as FailureResult<T, ExplicitErrorType>;
  }

  static of<T, ExplicitErrorType extends Error = Error>(func: () => Promise<T>): PromiseResult<T, ExplicitErrorType>;

  static of<T, ExplicitErrorType extends Error = Error>(func: () => T): Result<T, ExplicitErrorType>;

  static of<T, ExplicitErrorType extends Error = Error>(value: Promise<T>): PromiseResult<T, ExplicitErrorType>;
  static of<T, ExplicitErrorType extends Error = Error>(value: T): SuccessResult<T, ExplicitErrorType>;

  static of<T, ExplicitErrorType extends Error = Error>(funcOrValue: (() => any) | T) {
    try {
      if (typeof funcOrValue === 'function') {
        const ret = (funcOrValue as (() => any))()
        if (ret.then) {
          return ret.then((v: T) => Result.success(v)).catch((exception: Error) => {
            return Result.failure(exception);
          })
        }
        return Result.success(ret)
      }
      if ((funcOrValue as Promise<T>).then) {
        return (funcOrValue as Promise<T>).then((v: T) => Result.success(v)).catch((exception: Error) => {
          return Result.failure(exception);
        })
      }
      return Result.success(funcOrValue);
    } catch (exception: any) {
      return Result.failure(exception)
    }
  }

  isSuccess(): this is SuccessResult<T, ExplicitErrorType> {
    return !(this.value instanceof Failure);
  }

  isFailure(): this is FailureResult<T, ExplicitErrorType> {
    return this.value instanceof Failure;
  }

  getOrNull(): T;
  getOrNull(): null;
  getOrNull(): T | null {
    if (this.isFailure()) {
      return null;
    } else {
      return (this as Result<T>).value as T;
    }
  }

  throwOnFailure(): never;
  throwOnFailure(): void;
  throwOnFailure() {
    if (this.value instanceof Failure) throw this.value.exception
  }

  getOrThrow(): T;
  getOrThrow(): never;
  getOrThrow(): T {
    this.throwOnFailure()
    return this.value as T
  }

  getOrElse<R extends T>(onFailure: (exception: Error) => R): R {
    if (this.isFailure()) {
      return onFailure(this.value.exception)
    }
    return (this as Result<T>).value as R
  }

  exceptionOrNull(): null;
  exceptionOrNull(): ExplicitErrorType | Error;
  exceptionOrNull(): ExplicitErrorType | Error | null {
    if (this.value instanceof Failure) {
      return this.value.exception;
    } else {
      return null;
    }
  }

  exception(): never;
  exception(): ExplicitErrorType | Error;
  exception(): ExplicitErrorType | Error {
    if (this.value instanceof Failure) {
      return this.value.exception;
    } else {
      throw new TypeError(`${this} isn't failed.`)
    }
  }

  toString(): string {
    if (this.value instanceof Failure) {
      return this.value.toString();
    } else {
      return `Success(${this.value})`;
    }
  }
}


export type PromiseResult<T, ExplicitErrorType extends Error = Error> = Promise<Result<T, ExplicitErrorType>>
// https://github.com/Microsoft/TypeScript/issues/12776
export const PromiseResult = Promise
