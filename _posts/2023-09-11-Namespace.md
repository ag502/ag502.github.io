---
title: Namespace
date: 2023-09-11
categories: [TypeScript]
tags: [TypeScript]
image:
  path: /assets/img/ts-main.png
  alt: typescript logo
---

## 💻 Namespace 란?

`TypeScript` 에서 코드를 논리적인 단위로 묶어주는 역할을 합니다.코드를 묶어줌으로써, 캡슐화 및 모듈화를 적용할 수 있고 이를 통해 이름 충돌(name collision)을 피할 수 있습니다.  
`namespace` 를 통한 모듈화는 실행 환경에 따른 모듈시스템에 영향을 받지 않습니다. 즉 `namespace` 를 컴파일한 `JavaScript` 코드에는 `require/exports`(`module` 옵션이 `Node` 인 경우)나 `import/export`(`module` 옵션이 `ES6` 인 경우) 문이 포함되지 않습니다.

## 💻 모듈화 및 캡슐화

```typescript
// validators.ts
interface StringValidator {
  isAcceptable(s: string): boolean;
}

let lettersRegexp = /^[A-Za-z]+$/;
let numberRegexp = /^[0-9]+$/;

class LettersOnlyValidator implements StringValidator {
  isAcceptable(s: string) {
    return lettersRegexp.test(s);
  }
}

class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}

let strings = ["Hello", "98052", "101"];

let validators: { [s: string]: StringValidator } = {};
validators["Zip code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();

for (let s of strings) {
  for (let name in validators) {
    let isMatch = validators[name].isAcceptable(s);
    console.log(`'${s}' ${isMatch ? "matches" : "does not match"} '${name}'.`);
  }
}
```

위 `validators.ts` 파일은 `script` 파일이므로, 모든 변수를 전역으로 참조할 수 있습니다.  
만약 코드가 프로젝트의 규모가 커지면, 유지 보수가 어려워지고 변수의 이름도 충돌할 수 있기 때문에 논리적인 단위로 묶어 모듈화 시켜야 합니다.

```typescript
// validators.ts

// ...생략...
namespace Validation {
  let lettersRegexp = /^[A-Za-z]+$/;
  let numberRegexp = /^[0-9]+$/;

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }

  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
// ...생략...
```

`Validation` 이라는 이름을 가진 `namespace` 로 검증로직 및 정규 표현식을 모듈화 했습니다. `export` 되지 않은 정규표현식들은 `namespace` 외부에서 참조할 수 없고, `export` 된 `class` 들만 `[namespace].[exported value]` 형식을 사용하여 외부에서 참조할 수 있습니다.  
따라서 검증로직을 사용하는 코드들은 아래와 같이 변경되어야 합니다.

```typescript
// validators.ts

// ...생략...

// Validation.lettersRegexp -> Error
let strings = ["Hello", "98052", "101"];

let validators: { [s: string]: StringValidator } = {};
validators["Zip code"] = new Validation.ZipCodeValidator(); // 변경
validators["Letters only"] = new Validation.LettersOnlyValidator(); // 변경

for (let s of strings) {
  for (let name in validators) {
    let isMatch = validators[name].isAcceptable(s);
    console.log(`'${s}' ${isMatch ? "matches" : "does not match"} '${name}'.`);
  }
}
```

#### 🖊 `namespace` 컴파일

> 위 코드에서 `namespace` 를 적용한 부분을 컴파일한 결과물은 아래와 같습니다.
>
> ```javascript
> var Validation;
> (function (Validation) {
>     let lettersRegexp = /^[A-Za-z]+$/;
>     let numberRegexp = /^[0-9]+$/;
>     class LettersOnlyValidator {
>         isAcceptable(s) {
>             return lettersRegexp.test(s);
>         }
>     }
>     Validation.LettersOnlyValidator = LettersOnlyValidator;
>     class ZipCodeValidator {
>         isAcceptable(s) {
>             return s.length === 5 && numberRegexp.test(s);
>         }
>     }
>     Validation.ZipCodeValidator = ZipCodeValidator;
> })(Validation || (Validation = {}));>
> ```
