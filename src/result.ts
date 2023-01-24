export default class Result<T> {
  private readonly value: any;

  private constructor(value: any) {
    this.value = value;
  }

  get isSuccess(): boolean {
    return !(this.value instanceof Failure);
  }

  get isFailure(): boolean {
    return this.value instanceof Failure;
  }

  static success<T>(value: T): Result<T> {
    return new Result(value);
  }

  static failure<T>(exception: Error): Result<T> {
    return new Result(createFailure(exception));
  }

  static of<T>(func: () => Promise<T>): Promise<Result<T>>;
  static of<T>(func: () => T): Result<T>;
  static of<T>(func: () => any) {
    try {
      const ret = func()
      if (ret.then) {
        return ret.then((v: T) => Result.success(v)).catch((exception: Error) => {
          return Result.failure(exception);
        })
      }
      return Result.success(ret)
    } catch (exception: any) {
      return Result.failure(exception)
    }
  }

  getOrNull(): T | null {
    if (this.isFailure) {
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
    if (this.isFailure) {
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

  toString(): string {
    if (this.value instanceof Failure) {
      return this.value.toString();
    } else {
      return `Success(${this.value})`;
    }
  }
}

class Failure {
  exception: Error;

  constructor(exception: Error) {
    this.exception = exception;
  }

  toString(): string {
    return `Failure(${this.exception})`;
  }
}

function createFailure(exception: Error): Failure {
  return new Failure(exception);
}
