import { FailureResult, SuccessResult } from "./types";
import Failure from "./failure";

export default class Result<T, ExplicitErrorType extends Error = Error> {

  private constructor(value: any) {
    (this as unknown as {value: any}).value = value;
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
  static of<T, ExplicitErrorType extends Error = Error>(value: T): Result<T, ExplicitErrorType>;

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
    return !((this as unknown as {value: any}).value instanceof Failure);
  }

  isFailure(): this is FailureResult<T, ExplicitErrorType> {
    return (this as unknown as {value: any}).value instanceof Failure;
  }

  getOrNull(): T | null {
    if (this.isFailure()) {
      return null;
    } else {
      return ((this as unknown as {value: any})).value as T;
    }
  }

  throwOnFailure() {
    if ((this as unknown as {value: any}).value instanceof Failure) throw (this as unknown as {value: any}).value.exception
  }

  getOrThrow(): T {
    this.throwOnFailure()
    return (this as unknown as {value: any}).value as T
  }

  getOrElse<R extends T>(onFailure: (exception: Error) => R): R {
    if (this.isFailure()) {
      return onFailure(((this as unknown as {value: any})).value.exception)
    }
    return ((this as unknown as {value: any})).value as R
  }

  exceptionOrNull(): ExplicitErrorType | Error | null {
    if ((this as unknown as {value: any}).value instanceof Failure) {
      return (this as unknown as {value: any}).value.exception;
    } else {
      return null;
    }
  }

  exception(): ExplicitErrorType | Error {
    if ((this as unknown as {value: any}).value instanceof Failure) {
      return (this as unknown as {value: any}).value.exception;
    } else {
      throw new TypeError(`${this} isn't failed.`)
    }
  }

  toString(): string {
    if ((this as unknown as {value: any}).value instanceof Failure) {
      return (this as unknown as {value: any}).value.toString();
    } else {
      return `Success(${(this as unknown as {value: any}).value})`;
    }
  }
}


export type PromiseResult<T, ExplicitErrorType extends Error = Error> = Promise<Result<T, ExplicitErrorType>>
// https://github.com/Microsoft/TypeScript/issues/12776
export const PromiseResult = Promise
