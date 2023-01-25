import {FailureResult, PromiseResult, ResultUnknown, SuccessResult} from "./types";
import Failure from "./failure";

export default class Result<T> {
  private readonly value: any;

  private constructor(value: any) {
    this.value = value;
  }

  static success<T>(value: T): SuccessResult<T> {
    return new Result(value) as unknown as SuccessResult<T>;
  }

  static failure<T>(exception: Error): FailureResult<T> {
    return new Result(Failure.createFailure(exception)) as unknown as FailureResult<T>;
  }

  static of<T>(func: () => Promise<T>): PromiseResult<T>;

  static of<T>(func: () => T): ResultUnknown<T>;

  static of<T>(value: T): ResultUnknown<T>;

  static of<T>(funcOrValue: (() => any) | T) {
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
      return Result.success(funcOrValue);
    } catch (exception: any) {
      return Result.failure(exception)
    }
  }

  isSuccess(): this is SuccessResult<T> {
    return !(this.value instanceof Failure);
  }

  isFailure(): this is FailureResult<T> {
    return this.value instanceof Failure;
  }

  getOrNull(): T | null {
    if (this.isFailure()) {
      return null;
    } else {
      return this.value as T;
    }
  }

  throwOnFailure() {
    if (this.value instanceof Failure) throw this.value.exception
  }


  getOrThrow(): T {
    this.throwOnFailure()
    return this.value as T
  }

  getOrElse<R extends T>(onFailure: (exception: Error) => R): R {
    if (this.isFailure()) {
      return onFailure(this.value.exception)
    }
    return this.value as R
  }

  exceptionOrNull(): Error | null {
    if (this.value instanceof Failure) {
      return this.value.exception;
    } else {
      return null;
    }
  }

  exception(): Error {
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

