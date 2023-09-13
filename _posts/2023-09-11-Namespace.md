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

## 💻 Encapsulation

```typescript
// Validators.ts
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

위 `Validators.ts` 파일은 `script` 파일이므로, 모든 변수를 전역으로 참조할 수 있습니다.  
만약 코드가 프로젝트의 규모가 커지면, 유지 보수가 어려워지고 변수의 이름도 충돌할 수 있기 때문에 논리적인 단위로 묶어 모듈화 시켜야 합니다.

```typescript
// Validators.ts

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
// Validators.ts

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
// Validators.ts

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
// Validators.ts

// ...생략...

import Types = Validator.Types;
import Classes = Validator.Classes;

let validators: { [s: string]: Types.StringValidator } = {};
validators["Zip code"] = new Classes.ZipCodeValidator();
validators["Letters only"] = new Classes.LettersOnlyValidator();

// ...생략...
```

위 예시처럼 `import q = x.y.z` 표현식을 사용하면 `alias` 를 할 수 있습니다.

`Alias` 를 하려는 것이 값(value)이면, 변수에 할당해 `alias` 를 할 수 있고, 타입의 경우 `type` 에 할당해 `alias` 를 할 수도 있습니다.

```typescript
// ...생략...
type Types = Validator.Types;
const Classes = Validator.Classes;
// ...생략...
```

## 💻 Multi-file namespaces

로직을 재사용하기 위해, 일반적으로 파일을 분리해 모듈화시킨 후 해당 파일내부에 연관된 로직을 작성합니다. 위에서 살펴본 `Validators.ts` 파일의 `namespace` 도 분리해보겠습니다.

```typescript
// Validation.ts

export namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

```typescript
// LettersOnlyValidators.ts

import { Validation } from "./Validation";

export namespace LettersOnlyValidators {
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements Validation.StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
```

```typescript
// ZipCodeValidators.ts

import { Validation } from "./Validation";

export namespace ZipCodeValidators {
  const numberRegexp = /^[0-9]+$/;
  export class ZipCodeValidator implements Validation.StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
```

```typescript
// Test.ts

import { Validation } from "./Validation";
import { LettersOnlyValidators } from "./LettersOnlyValidators";
import { ZipCodeValidators } from "./ZipCodeValidators";

let strings = ["Hello", "98052", "101"];

let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new ZipCodeValidators.ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidators.LettersOnlyValidator();

for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? "matches" : "does not match"
      } ${name}`
    );
  }
}
```

분리된 파일에 작성된 `namespace` 를 `export` 구문으로 내보내고, `import` 구문으로 가져오는 것을 볼 수 있습니다. 해당 방식을 사용하여 모듈화를 시킬 수 있지만, 특정 환경의 모듈 시스템에 의존성이 생긴다는 문제가 발생합니다.

## 💻 Triple-Slash Directives

`TypeScript` 에서 제공하는 `Triple-Slash Directive` 를 사용하여 모듈을 임포트하면 위의 문제점을 해결할 수 있습니다.

> <span style="color:cyan;">&lt;reference path="..."/ &gt;</span>

위의 지시어를 파일의 최상단에 위치시켜 주면, `path` 에 명시된 경로의 파일을 컴파일 단계에서 포함시킵니다.

`Triple-Slash Directives` 를 사용해 위의 코드를 아래와 같이 변경할 수 있습니다.

```typescript
// Validation.ts

export namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

```typescript
// LettersOnlyValidators.ts

/// <reference path="Validation.ts"/>
import { Validation } from "./Validation";

export namespace LettersOnlyValidators {
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements Validation.StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
```

```typescript
// ZipCodeValidators.ts

/// <reference path="Validation.ts"/>
namespace ZipCodeValidators {
  const numberRegexp = /^[0-9]+$/;
  export class ZipCodeValidator implements Validation.StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
```

```typescript
// Test.ts

/// <reference path="Validation.ts"/>
/// <reference path="LettersOnlyValidators.ts"/>
/// <reference path="ZipCodeValidators.ts"/>
import { Validation } from "./Validation";
import { LettersOnlyValidators } from "./LettersOnlyValidators";
import { ZipCodeValidators } from "./ZipCodeValidators";

let strings = ["Hello", "98052", "101"];

let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new ZipCodeValidators.ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidators.LettersOnlyValidator();

for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? "matches" : "does not match"
      } ${name}`
    );
  }
}
```

위 코드에서 `tsc Test.ts` 을 실행시키면, `Test.ts` 파일과 의존성을 가진 파일 모두 컴파일 되게 됩니다.

주의할 점은, 컴파일된 `Test.js` 파일은 실행할 수 없습니다. `Tripe-Slash Directives` 는 모듈간 의존성을 나타내는 역할을 할 뿐, 실제로 모듈을 임포트 하지 않기 때문입니다.  
`Test.js` 파일을 환경별로 실행하는 방법은 다음과 같습니다.

- `Node`  
  `TSConfig` 의 `outFile` 옵션을 지정해 컴파일에 포함된 모듈들을 하나의 파일로 합친후 실행해야 합니다.  
  파일을 합칠때 컴파일러는 `reference` 태그를 기반으로 모듈을 자동정렬 합니다.

  > \> tsc Test.ts \--outfile bundle.js  
  > \> node Test.js

- `Browser`  
  `script` 태그에 의존성을 갖는 순서대로 컴파일된 모듈들을 명시해 주거나, `outFile` 옵션을 지정해 하나로 합쳐진 파일을 명시해 주어 실행시킬 수 있습니다.

## 💻 Namespace merging

`Namespace` 는 `interface` 처럼 같은 식별자를 가진 것들 끼리 병합(merging)이 됩니다.

```typescript
// Validation.ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

```typescript
// LetterOnlyValidations.ts

/// <reference path="Validation.ts"/>

namespace Validation {
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
```

```typescript
// ZipCodeValidators.ts

/// <reference path="Validation.ts" />
namespace Validation {
  const numberRegexp = /^[0-9]+$/;
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
```

`LetterOnlyValidations.ts` 파일은 `Validation.ts` 와 같은 식별자의 `namespace` 를 가지고 있으며, `Validation.ts` 를 참조하고 있으므로 `Validation` `namespace` 는 병합됩니다. `ZipCodeValidators.ts` 파일 역시 마찬가지 입니다.

위 코드를 컴파일한 `JavaScript` 파일은 다음과 같습니다.

```javascript
/// <reference path="Validation.ts"/>
var Validation;
(function (Validation) {
  const lettersRegexp = /^[A-Za-z]+$/;
  class LettersOnlyValidator {
    isAcceptable(s) {
      return lettersRegexp.test(s);
    }
  }
  Validation.LettersOnlyValidator = LettersOnlyValidator;
})(Validation || (Validation = {}));
/// <reference path="Validation.ts"/>
var Validation;
(function (Validation) {
  const numberRegexp = /^[0-9]+$/;
  class ZipCodeValidator {
    isAcceptable(s) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
  Validation.ZipCodeValidator = ZipCodeValidator;
})(Validation || (Validation = {}));
```

`Validation` 객체안에 병합된 `class` 들이 지정되는 것을 볼 수 있습니다.
