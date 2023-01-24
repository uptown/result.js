# Result.js

- A Typescript implementation of `Result` in Kotlin.

## Getting Started

### npm
`npm i @leejuyoung/result`

### yarn
`yarn add @leejuyoung/result`

## Examples

```typescript
import Result from " @leejuyoung/result";

function doSomething(): Result<string> {
  try {
    return Result.success("success")
  } catch (e) {
    return Result.failure(e)
  }
}


if(doSomething().isSuccess){
  // do Something
}
```

```typescript
import Result from " @leejuyoung/result";

async function doSomething(): Promise<Result<string>> {
  await Result.of(async () => {
    try {
      return "success"
    } catch (e) {
      throw e
    }
  })
}


if((await doSomething()).isSuccess){
  // do Something
}
```
