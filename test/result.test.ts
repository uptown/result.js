import {expect} from "@jest/globals";
import {Result} from "../src";

describe("Result.js", function () {
  test("success", async function () {
    const ret = new Result("asd")

    expect(ret.isSuccess).toBeTruthy()
    expect(ret.isFailure).toBeFalsy()

    expect(ret.getOrThrow()).toEqual("asd")
  })
  test("fail", async function () {
    const ret = Result.failure(new Error("asd"))

    expect(ret.isSuccess).toBeFalsy()
  })
})
