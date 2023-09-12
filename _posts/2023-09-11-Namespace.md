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

## 💻 Modularization & Encapsulation

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
>
> 모듈 시스템을 사용하지 않고 `IIFE` 를 이용하여 모듈화를 구현했습니다.  
> 이를 통해, `namespace` 는 실행 환경에 따른 모듈시스템에 영향을 받지 않는다는 것을 볼 수 있습니다.

## 💻 Export Types & Namespace

타입이나 `namespace` 도 `namespace` 안에 포함되어 `export` 될 수 있습니다.

```typescript
// validators.ts

namespace Validator {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
  // ...생략...
}

// ...생략...
let validators: { [s: string]: Validation.StringValidator } = {};
// ...생략...
```

`StringValidator` 인터페이스가 `namespace` 내부에서 `export` 되고 있기때문에 `Validator.StringValidator` 로 참조하고 있음을 알 수 있습니다.

`Namespace` 도 같은 방식으로 `namespace` 내부에서 사용할 수 있습니다.

```typescript
namespace Validator {
  export namespace Types {
    export interface StringValidator {
      isAcceptable(s: string): boolean;
    }
  }

  let lettersRegexp = /^[A-Za-z]+$/;
  let numberRegexp = /^[0-9]+$/;

  export namespace Classes {
    export class LettersOnlyValidator implements Types.StringValidator {
      isAcceptable(s: string) {
        return lettersRegexp.test(s);
      }
    }

    export class ZipCodeValidator implements Types.StringValidator {
      isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
      }
    }
  }
}

// ...생략...
let validators: { [s: string]: Validation.Types.StringValidator } = {};
validators["Zip code"] = new Validation.Classes.ZipCodeValidator();
validators["Letters only"] = new Validation.Classes.LettersOnlyValidator();
// ...생략...
```

## 💻 Alias

`Namespace` 안에 `namespace` 를 중첩해 사용하는 경우, 내부 `namespace` 의 변수 참조시 코드가 길어질 수 있습니다.  
위에서 살펴본 코드에서 `Validation.Types.StringValidator`, `Validation.Classes.ZipCodeValidator` 와 `Validation.Classes.LettersOnlyValidator` 가 그 예시입니다.

`Alias` 를 통해 이 문제를 해결할 수 있습니다.

```typescript
// validators.ts

// ...생략...

import Types = Validator.Types;
import Classes = Validator.Classes;

let validators: { [s: string]: Types.StringValidator } = {};
validators["Zip code"] = new Classes.ZipCodeValidator();
validators["Letters only"] = new Classes.LettersOnlyValidator();

// ...생략...
```

위 예시처럼 `import [alias] =` 표현식을 사용하면 `alias` 를 할 수 있습니다.

`Alias` 를 하려는 것이 값(value)이면, 변수에 할당해 `alias` 를 할 수 있고, 타입의 경우 `type` 에 할당해 `alias` 를 할 수도 있습니다.

```typescript
// ...생략...
type Types = Validator.Types;
const Classes = Validator.Classes;
// ...생략...
```

## 💻 Multi-file namespaces
