import {expect} from "@jest/globals";
import {Result} from "../src";

describe("Result.js", function () {
  test("success", async function () {
    const ret = Result.success("asd")

    expect(ret.isSuccess()).toBeTruthy()
    expect(ret.isFailure()).toBeFalsy()

    expect(ret.getOrThrow()).toEqual("asd")
  })
  test("fail", async function () {
    const ret = Result.failure(new Error("asd"))

    expect(ret.isSuccess()).toBeFalsy()
  })
  test("of value", async function () {
    const ret = Result.of("asd")

    expect(ret.getOrThrow()).toEqual("asd")
  })
  test("of function", async function () {
    const ret = Result.of(() => "asd")

    expect(ret.getOrThrow()).toEqual("asd")
  })
  test("of async function", async function () {
    const ret = await Result.of(async () => "asd")

    expect(ret.getOrThrow()).toEqual("asd")
  })
  test("of async function error", async function () {
    const ret = await Result.of(async () => {
      throw new Error("asd")
    })

    expect(() => ret.getOrThrow()).toThrowError(new Error("asd"))
  })
  test("type checking", async function () {
    const ret = await Result.of(async () => "asd")

    if (ret.isFailure()) {
      if (ret) {

      }
      const exception = ret.exceptionOrNull()
      if (exception.message) {

      }
    } else {
      const value = ret.getOrThrow()

      if (value.length) {
        // type is
      }
    }
    expect(() => ret.getOrThrow()).toThrowError(new Error("asd"))
  })
})
