---
title: 타입 선언 파일 (Type Definition File)
date: 2023-09-16
categories: [TypeScript]
tags: [TypeScript]
image:
  path: /assets/img/ts-main.png
  alt: typescript logo
---

## 💻 타입 선언 파일 (`Type Definition File`) 이란?

`.d.ts` 라는 확장자를 가진 파일로, 값이나 함수등의 구현없이 타입이나 값의 존재를 선언하는 방법을 제공합니다.  
`.ts` 확장자를 가진 파일은 '구현' 파일로 타입과 실행가능한 코드 모두를 포함할 수 있으며, 컴파일시 `JavaScript` 파일로 변환됩니다.
반면에 타입 선언 파일의 경우 타입에 대한 정보만 가질 수 있으며 `JavaScript` 파일로 변환되지 않습니다.

## 💻 Built-in Type Definitions

`TypeScript` 는 `JavaScript` 에서 사용되는 표준 API (standardized built-in API) 에 대한 `타입 선언 파일` 을 기본으로 가지고 있습니다.

![standard-library-1](/assets/img/type-definition/standard-library-1.png)

`Math` 의 타입을 따로 정의한적이 없음에도 위와 같이 타입이 추론이 되는 것은 내장된 `타입 선언 파일` 들 때문입니다.  
`TypeScript` 의 내장된 선언 파일들은 `lib.[something].d.ts` 와 같은 이름 형식을 가지며, 따로 임포트하지 않고 전역으로 사용 가능합니다.

`TSConfig` 파일의 [`lib`](https://ag502.github.io/posts/ts-config/#2%EF%B8%8F%E2%83%A3-lib) 옵션을 통해 어떤 표준 API의 `타입 선언 파일` 을 포함할 것인지 지정할 수 있습니다.

```json
{
  "compilerOptions": {
    "lib": ["ES6"]
  }
}
```

위와 같이 `lib` 옵션을 `ES6` 만 지정했을 때, `document` 를 참조할 경우 타입 오류가 발생합니다. `document` 에 대한 타입은 `lib.dom.d.ts` 에 존재하기 때문입니다.

![standard-library-2](/assets/img/type-definition/standard-library-2.png)

## 💻 Global Custom Type Definition

프로젝트 전역에서 공통으로 사용되는 타입이 있다고 가정해 보겠습니다. 이 타입을 전역에서 사용하기 위한 단계들을 살펴보겠습니다.

1. `types` 디렉토리를 만든 후, 하위에 `common` 디렉토리를 생성합니다. 전역에서 공통으로 사용하는 타입들을 해당 디렉토리에 위치 시키겠습니다.  
   ![global-custom-type-1](/assets/img/type-definition/global-custom-type-1.png)

2. `types` 디렉토리를 `typeRoots` 옵션에 추가합니다.  
    [`typeRoots`](https://ag502.github.io/posts/ts-config/#3%EF%B8%8F%E2%83%A3-typeroots) 에 해당 디렉토리를 추가함으로써, `TypeScript` 가 옵션에 명시된 디렉토리에서 타입을 참조하게 합니다.
   `typeRoots` 의 기본값인 `node_modules/@types` 를 제외한 디렉토리를 지정할 때, `node_modules/@types` 는 포함되지 않습니다. 즉 기본값이더라도, 다시 옵션에 포함시켜야 합니다.

   ```json
   {
     "files": ["./index.ts"],
     "compilerOptions": {
       "outDir": "./dist",
       "typeRoots": ["node_modules/@types", "./types"]
     }
   }
   ```

3. `타입 선언 파일` 의 `entry file` 을 작성합니다.  
    `타입 선언 파일` 을 찾는 방법도 `TypeScript` 의 [`Module Resolution Strategy`](https://ag502.github.io/posts/Module-Resolution/#-module-resolution-strategy) 와 유사합니다.  
    따라서 `entry file` 의 이름이 `index.d.ts` 이거나, `package.json` 의 `types/typing` 필드가 `entry file` 을 가리켜야 합니다.

   - `index.d.ts` 작성  
      ![global-custom-type-2](/assets/img/type-definition/global-custom-type-2.png)

     ```typescript
     // index.d.ts

     interface Shape {
       kind: "circle" | "square";
       radius?: number;
       sideLength?: number;
     }
     ```

     ```typescript
     // index.ts

     const circle: Shape = {
       radius: 2 * Math.PI,
     };
     ```

     위와 같이 `common` 디렉토리 하위에 `index.d.ts` 를 생성할 경우, 아래의 이미지처럼 정상적으로 타입 추론이 된것을 볼 수 있습니다.  
     ![global-custom-type-3](/assets/img/type-definition/global-custom-type-3.png)

   - `package.json` 작성  
     위에서 작성한 `index.d.ts` 파일의 이름을 `main.d.ts` 로 수정해 보겠습니다.  
     이 경우 `TypeScript` 는 `Module Resolution Strategy` 전략에 따라 `타입 선언 파일` 의 위치를 찾지 못해 `index.ts` 와 `TSConfig` 파일에 오류 메세지를 출력합니다.  
     ![global-custom-type-5](/assets/img/type-definition/global-custom-type-5.png)

     `Entry file` 의 이름이 `index.d.ts` 가 아닌 경우는 `package.json` 파일의 `types/typing` 필드에 `타입 선언 파일` 을 명시해 주어야 합니다.  
     ![global-custom-type-4](/assets/img/type-definition/global-custom-type-4.png)

     ```json
     // package.json

     {
       "name": "common",
       "version": "1.0.0",
       "types": "./main.d.ts"
     }
     ```

## 💻 타입 선언 파일 모듈화

만약 전역에서 공통으로 사용해야하는 타입들의 종류가 많다면 모듈화를 시켜야 합니다.

![type-modularization-1](/assets/img/type-definition/type-modularization-1.png)

```typescript
// interface.d.ts

interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

```typescript
// function.d.ts

type getArea = (shape: Shape) => number | undefined;
```

위 예시는 `Shape` `interface` 를 `interface.d.ts` 파일로 분리시키고, `getArea` 함수의 타입을 `function.d.ts` 파일에 선언한 것 입니다.  
이 `타입 선언 파일` 들을 `index.d.ts` 에 임포트 하기 위해서는 `Triple-Slash Directives` 를 사용해야 합니다.

```typescript
// index.d.ts

/// <reference path="./interface.d.ts"/>
/// <reference path="./function.d.ts" />
```

한가지 특이한 점은 `function.d.ts` 에서 `interface.d.ts` 에 선언된 `Shape` `interface` 를 사용하고 있다는 점입니다. 이는 `reference` 로 참조된 파일끼리는 값이나 타입을 공유할 수 있기 때문입니다.

```typescript
// index.ts

const circle: Shape = {
  kind: "circle",
  radius: 2 * Math.PI,
};

const getArea: GetArea = (shape: Shape) => {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius! ** 2;
  }
};

console.log(getArea(circle));
```

전역으로 작성한 타입들을 이용해, 임포트 없이 타입을 사용하고 있음을 볼 수 있습니다.

#### 🖊 `import` 문을 사용하여 `타입 선언 파일` 가져오기

> `index.d.ts` 파일에서 `import` 문으로 `타입 선언 파일` 을 가져올 수 있습니다.
>
> ```typescript
> // index.d.ts;
>
> import "./interface";
> import "./function";
> ```
>
> 위 코드는 `reference` 를 사용하였던 앞선 코드와 같습니다.  
> 단 `import` 문을 사용하면 `index.d.ts` 는 모듈이 되어 해당 파일에 선언한 타입들은 전역으로 사용할 수 없게됩니다.
> 모듈 파일에서 전역 타입을 선언하는 방법은 아래에서 살펴보도록 하겠습니다.

## 💻 DefinitelyTyped / `@types`

`DefinitelyTyped` 은 `JavaScript` 로 작성된 라이브러리의 `타입 선언 파일` 을 제공하고 있습니다.  
`@types/[package]` 형식의 이름을 가지고 있으며, `node_modules/@types` 하위 경로에 설치 됩니다. 또한 `typeRoots` 옵션의 기본값이 `node_modules/@types` 이기 때문에, 설치 후 바로 타입이 인식됩니다.

## 💻 Ambient Declarations

`Ambient Declarations` 이란 다른 곳에 구현이 존재하는 코드의 타입을 정의하는 방법입니다.  
예를 들어, `window` 의 경우 실행시점에 값이 존재하게 됩니다. 아래와 같이 `TSConfig` 의 `lib` 옵션을 `ES6` 로 지정하고 코드에 `window` 를 사용하려고 하면 타입오류가 발생합니다.

```json
{
  "files": ["./index.ts"],
  "compilerOptions": {
    "outDir": "./dist",
    "typeRoots": ["./types"],
    "lib": ["ES6"]
  }
}
```

![ambient-declaration-1](/assets/img/type-definition/ambient-declaration-1.png)

`window` 객체는 런타임에 존재하는 값(다른 곳에 구현이 존재)이어서, 프로젝트내에 따로 값을 정의하지 않았기 때문입니다.  
따라서 `declare` 이라는 키워드를 사용해 `TypeScript` 에게 `window` 라는 값이 런타임에 존재하는 값임을 알려야 합니다.

> declare var window: any

위의 코드는 `window` 객체를 `any` 타입으로 선언한 `ambient declaration` 의 예시입니다.  
타입이 `any` 이기때문에 `window` 에 어떤값을 할당해도 오류가 발생하지 않습니다.

#### 🖊 `Window` 타입

> `window` 객체는 `lib.dom.ts` 에 아래와 같이 타입이 정의되어 있습니다.
>
> ```typescript
> declare var window: Window & typeof globalThis;
> ```
>
> 만약 `window` 객체에 추가적인 함수나 값을 추가하고 싶다면 `interface` 병합을 사용해 타입을 추가할 수 있습니다.
>
> ```typescript
> interface Window {
>   helloWorld(): void;
> }
>
> window.helloWorld();
> ```

### 👨‍💻 Ambient Namespace

앞서 살펴본 `Global Custom Type Definition` 에서 전역으로 선언했던 타입들의 이름은 다른 타입들과 이름이 겹칠 가능성이 있습니다.  
예를 들어, `Shape` 인터페이스를 3rd party library 에서 사용하고 있다면, 의도치 않은 `interface` 병합이 발생할 수도 있습니다.
`Ambient namespace` 를 사용하면 이런 현상을 막을 수 있습니다.

```typescript
// interface.d.ts

declare namespace Common {
  interface Shape {
    kind: "circle" | "square";
    radius?: number;
    sideLength?: number;
  }
}
```

```typescript
// function.d.ts

declare namespace Common {
  type getArea = (shape: Shape) => number | undefined;
}
```

추가로 `Ambient namespace` 내부에 선언된 타입들은 따로 `export` 하지 않아도 암시적으로 `export` 가 됩니다.

### 👨‍💻 `declare global`

`interface` 와 `namespace` 모두 병합(merge)이 되는 특성이 있습니다. 이 특성을 이용해 타입을 보강할 수 있습니다.

```typescript
// index.ts

interface Shape {
  name: string;
}

const circle: Shape = {
  kind: "circle",
};
```

위 예시는 전역으로 선언된 `Shape` `interface` 에 `string` 타입의 `name` 속성을 추가한 것입니다. `name` 속성이 필수로 지정되었기 때문에 `circle` 변수는 타입오류가 발생합니다.

![ambient-declaration-2](/assets/img/type-definition/ambient-declaration-2.png)

한가지 유의할 점은, 병합은 `module` 파일에서는 발생하지 않는다는 점입니다.

```typescript
// index.ts

interface Shape {
  name: string;
}

const circle: Shape = {
  kind: "circle",
};

export {};
```

위 코드는 `export {}` 를 추가해 `index.ts` 를 `module` 파일로 만든 것 입니다. 앞에서 살펴본 예시와 마찬가지로 타입오류가 발생하지만, 다른 유형의 오류가 발생합니다.

![ambient-declaration-3](/assets/img/type-definition/ambient-declaration-3.png)

`kind` 속성이 `Shape` `interface` 에 존재하지 않는다는 오류가 발생합니다. 이는 `index.ts` 파일이 `module` 파일로 전환되어 전역으로 선언된 `Shape` `interface` 와 지역적으로 선언된 `Shape` `interface` 가 병합되지 않았기 때문입니다. 따라서 `circle` 에 지정된 `Shape` 은 로컬에 선언된 `Shape` `interface` 만을 의미합니다.

`module` 파일에 선언된 타입을 전역으로 선언하거나, 전역으로 선언된 타입과 병합하려면 `declare global` 을 사용하면 됩니다.

```typescript
// index.ts

declare global {
  interface Shape {
    name: string;
  }
}

const circle: Shape = {
  kind: "circle",
};

export {};
```

`Shape` `interface` 를 `declare global` 로 감싸주면 해당 타입은 전역으로 선언되어 정상적으로 병합됨을 볼 수 있습니다.

### 👨‍💻 Ambient Module

`JavaScript` 로 작성된 라이브러리 중에서 `Definitely Typed` 에 `타입 선언 파일` 이 존재하지 않는 경우, 직접 `타입 선언 파일` 을 작성해야 합니다.

아래와 같은 구조를 가진 프로젝트가 있습니다.

![ambient-declaration-4](/assets/img/type-definition/ambient-declaration-4.png)

`packages` 디렉토리를 `node_modules` 로 가정하게 되면, `vehicle` 디렉토리는 설치된 라이브러리로 생각할 수 있습니다.  
`node_modules` 에 설치된 라이브러리처럼 비-상대 경로로 임포트하기 위해 `TSConfig` 의 [`baseURL`](https://ag502.github.io/posts/ts-config/#7%EF%B8%8F%E2%83%A3-baseurl) 옵션을 지정하겠습니다.

```json
{
  "files": ["./index.ts"],
  "compilerOptions": {
    "outDir": "./dist",
    "typeRoots": ["./types"],
    "baseUrl": "./packages"
  }
}
```

아래의 `vehicle.js` 코드를 `index.ts` 에 임포트 해보겠습니다.

```javascript
// vehicle.js

export class Vehicle {
  static name = "Vehicle";

  constructor(model, year, price) {
    this.model = model;
    this.year = year;
    this.price = price;
  }

  drive() {
    console.log("The vehicle is moving");
  }

  stop() {
    console.log("The vehicle stopped");
  }
}

export function getVehicleInfo(vehicle) {
  return `model: ${vehicle.model}, year: ${vehicle.year} price: ${vehicle.price}`;
}

export default "v1.0.0";
```

```typescript
// index.ts

import version, { Vehicle, getVehicleInfo } from "vehicle";

console.log(version);

const car: Vehicle = new Vehicle("car", 2023, 1000);

console.log(Vehicle.name);

car.drive();
car.stop();

const currentInfo = getVehicleInfo(car);

console.log(currentInfo);
```

`index.ts` 에 'vehicle' 을 임포트한 후 정의된 함수와 값을 사용하면, 해당 패키지의 `타입 선언 파일` 이 없기때문에 타입 추론이 정상적으로 되지 않는것을 알 수 있습니다.

타입 추론이 정상적으로 동작하게끔 하기위해 `types` 디렉토리 하위에 `타입 선언 파일` 을 만들어 보겠습니다.

```typescript
// types/vehicle/index.d.ts

declare module "vehicle" {
  export class Vehicle {
    static name: string;

    public model: string;
    public year: number;
    public price: number;

    constructor(model: string, year: number, price: number);

    drive(): void;
    stop(): void;
  }

  var version: string;
  export default version;
}

declare module "vehicle" {
  export function getVehicleInfo(vehicle: Vehicle): string;
}
```

위의 `타입 선언 파일` 을 추가하면 `index.ts` 의 타입 추론이 정상적으로 동작하게 됩니다.

`declare module "[module-name]"` 키워드를 `ambient module` 이라고 하며, 해당 모듈이 런타임시에 제공됨을 `TypeScript` 에게 알려주는 역할을 합니다.

#### 📗 참고자료

[Type Declarations](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html)  
[TypeScript Ambients Declaration](https://www.geeksforgeeks.org/typescript-ambients-declaration/)  
[AMBIENT NAMESPACES IN DECLARATION FILES](https://lukasznojek.com/blog/2020/02/typescript-declaration-files/)  
[TypeScript Ambient Module](https://elfi-y.medium.com/typescript-ambient-module-8816c9e5d426)  
[Mastering Declaration Files: The Key to TypeScript’s Type Magic](https://itnext.io/mastering-declaration-files-the-key-to-typescripts-type-magic-fe4483a86645)  
[Library Structures](https://www.typescriptlang.org/ko/docs/handbook/declaration-files/library-structures.html)  
[Modules .d.ts](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html)
