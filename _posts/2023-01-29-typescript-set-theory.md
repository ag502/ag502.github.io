---
title: TypeScript 타입 집합으로 생각하기
date: 2022-12-31
categories: [TypeScript]
tags: [TypeScript]
image:
  path: /assets/img/ts-main.png
  alt: typescript logo
---

## 💻 타입들을 집합으로 생각하기

TypeScript의 타입들을 할당가능한 값들의 집합이라고 생각하면, `|`, `&`등을 사용한 연산이나 `extends` 키워드를 사용해 정의한 새로운 타입들을 이해하기 수월해집니다. TypeScript를 집합관점에서 살펴보기 전에 알고 있어야 할 배경지식은 아래와 같습니다.

- `A extends B`는 `A ⊂ B`와 같습니다.
- `A는 B에 할당가능 한 값이 아닙니다`와 같은 TS오류는 `A ⊄ B`와 같습니다.
- 유니온 연산(`|`)과 인터섹션 연산(`&`)은 각각 집합 연산 `⋃`, `⋂`와 같습니다.
- `Exclude<A, B>`는 `A - B`와 같습니다.

## 💻 never

타입들을 집합으로 생각한다면 가장 적은 원소를 가진 집합은 `never` 타입입니다. `never` 타입은 아무런 값도 포함하지 않는 공집합(`∅`)으로 생각할 수 있습니다. `never` 타입으로 선언된 변수는 아무런 값도 할당할 수 없습니다.

![never-assign](/assets/img/typescript-set-theory/never-assign.png)

```typescript
// Error: Type 'number' is not assignable to type 'never'
const x: never = 12;
```

또한 `never`는 아래와 같은 특징을 가지고 있습니다.

```typescript
// never <-> A ⋂ ∅ = ∅
A & never;
// A <-> A ⋃ ∅ = A
A | never;
// never <-> 0 - 0 = ∅
Exclude<0, 0>;
```

## 💻 Literal Types

`never` 타입 다음으로 적은 원소를 가진 집합은 `literal type` 입니다. 이 타입은 하나의 원소를 가지고 있습니다. `literal type`은 `number`, `string`, `boolean` 타입들이 가질 수 있으며, 변수에 특정 값만 할당되게끔 제한하는 역할을 합니다. `literal type`은 `unit type`이라고 부르기도 합니다.

```typescript
type A = "A"; // string literal type
type B = "B"; // string literal type
type Twelve = 12; // number literal type
type True = true; // boolean literal type

const a: A = "B"; // Error
```

유니온 연산자(`|`)를 이용해 두개 이상의 `literal type` 타입들을 묶을 수 있습니다.

```typescript
type AB = "A" | "B";
type AB12 = "A" | "B" | 12;
```

유니온 연산으로 묶은 유니온 타입들은 타입들의 합집합을 의미합니다. 따라서 위의 타입 `AB`의 경우는 `literal type A`와 `literal type B`를 합집합이며, `A`이거나 `B`를 의미합니다. 아래처럼 합집합의 부분집합만 변수에 할당할 수 있습니다.

```typescript
// 정상 "A" ⊂ ("A" ⋃ "B")
const a: AB = "A";
// Error: Type '"C"' is not assignable to type 'AB'. <-> "C" ⊄ ("A" ⋃ "B")
const c: AB = "C";
```

## 💻 boolean, string

JavaScript는 7개의 원시타입 (`number`, `bigint`, `boolean`, `string`, `symbol`, `undefined`, `null`)을 가지고 있으며, 서로 비슷하게 동작합니다. `boolean`, `string` 타입을 통해 원시타입의 특징을 살펴보겠습니다.

### 👨‍💻 boolean

`boolean`타입은 `true`와 `false` 단 두개의 값을 원소로 가지고 있습니다. 따라서 `boolean` 타입을 `true literal type`과 `false literal type`의 합집합(유니온)으로 표현할 수 있습니다.

```typescript
type Boolean = true | false;
```

또한 아래와 같은 특징을 가집니다.

```typescript
// never <-> true ⋂ false = ∅
true & false;
// true <-> boolean ⋂ true = true
boolean & true;
// never <-> true ⋂ never = ∅
true & never;
// false <-> boolean - true
Exclude<boolean, true>;
```

`null`, `undefined`는 각각 하나의 값을 원소로 가진다는 특징을 제외하고는, `boolean`과 동일합니다.

### 👨‍💻 string

`string` 타입은 무한개의 값을 원소로 갖는 무한집합입니다.

위에서 살펴본 것 처럼, `string literal type`이나 유한한 `string literal type`들의 유니온 타입을 부분 집합으로 가질 수 있습니다.

```typescript
type Korea = "korea";
type America = "america";
type Country = Korea | America;
```

`string` 타입은 다른 원시타입과는 다르게 [`template literal type`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)이 있는데, 이를 이용하면 무한 집합을 부분집합으로 만들 수 있습니다.

```typescript
type Hello = `hello${string}`;
```

위 타입은 `hello`라는 문자열로 시작하는 모든 문자열을 나타내는 타입입니다.

한가지 주의할 점은 `string` 타입이 모든 가능한 `literal type`들의 합집합을 모델링 하고 있지 않다는 것입니다. 가령, `string` 타입에서 `a`라는 `literal type`을 제외시킨 타입은 `a`를 할당할 수 없지만, 실제로는 `string`타입으로 평가되어 정상적으로 할당할 수 있습니다.

```typescript
// string type
type ExceptA = Exclude<string, "a">;
const a: ExceptA = "a";
```

`number`, `symbol`, `bigint`와 같은 원시타입들도 `template literal type`을 제외하고는 `string` 타입과 동일하게 동작합니다.

## 💻 interface & object types

객체의 타입을 아래와 같이 표현할 수 있습니다.

```typescript
interface Identified {
  id: string;
}
```

타입스크립트는 구조적 타이핑을 지향하기 때문에, 어떤 객체가 `string` 타입의 `id` 프로퍼티를 갖는다면 그 객체는 `Identified` 타입입니다.

#### 🖊 구조적 타이핑이란?

> JavaScript의 덕 타이핑(duck typing)을 모델링한 것으로, 객체가 어떤 타입에 부합하는 변수와 메서드를 가질 경우 객체를 해당 타입에 속하는 것으로 간주하는 방식 입니다.

따라서 `Identified` 타입을 집합으로 생각해 본다면, 원소들은 `string` 타입의 `id` 프로퍼티를 같는 모든 객체입니다.

객체의 타입도 집합으로 생각할 수 있으므로, 유니온 및 인터섹션 연산을 처리할 수 있습니다.

```typescript
interface Person {
  name: string;
}

interface Lifespan {
  birth: Date;
  death?: Date;
}

type PersonSpan = Person & LifeSpan;
```

위의 예시에서, `PersonSpan` 타입은 `Person` 타입과 `Lifespan` 타입의 교집합을 의미함으로 결과는 아래와 같습니다.

```typescript
type PersonSpan = {
  name: string;
  birth: Date;
  death?: Date;
};
```

물론 구조적 타이핑으로 인해, 위에서 정의된 세개의 프로퍼티외의 프로퍼티를 가지고 있어도, `PersonSpan` 타입입니다.

> 🖊 객체의 인터섹션 타입은 각 타입 내의 속성을 모두 포함시키면 됩니다.  
> 하지만 유니온 타입의 경우는 위 규칙이 통하지 않습니다.
>
> ```typescript
> // never, 유니온 타입에 해당하는 키가 존재하지 않음
> type T = keyof (Person | Lifespan);
>
> keyof (A&B) = keyof A | keyof B
> keyof (A|B) = keyof A & keyof B
> ```

## 💻 잉여 속성 체크 (Excess Property Checking)

아래와 같은 상황을 살펴보겠습니다.

```typescript
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}

const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: "present",
  // Error: Object literal may only specify known properties, and 'elephant' does not exist in type 'Room'.
};
```

구조적 타이핑의 관점에서 보면 변수 `r`에 할당된 객체 리터럴은 `Room`타입에 포함되기 때문에, 오류가 발생하면 안되지만, 실제로는 발생합니다.
이는 TypeScript의 잉여 속성 체크라는 특징 때문입니다.

잉여 속성 체크는 `타입이 명시된 변수에 객체 리터럴을 할당할 때` 나, `함수의 인자로 객체 리터럴을 전달할 때` 해당 타입의 속성이 있는지, 그 외의 속성은 없는지 확인하는 특성입니다.

강조한 부분처럼 객체 리터럴을 직접 할당할 때만 동작합니다. 가령 아래와 같은 상황에서는 잉여 속성 체크가 동작하지 않습니다.

```typescript
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: "present",
};

const r: Room = obj;
```

잉여 속성 체크는 선택적 속성만 가지는 약한 타입에도 비슷하게 적용 됩니다.

```typescript
interface LineChartOptions {
  logScale?: boolean;
  invertedYAxis?: boolean;
  areaChart?: boolean;
}

const opts = { logscale: true };

//Error: Type '{ logscale: boolean; }' has no properties in common with type 'LineChartOptions'.
const o: LineChartOptions = opts;
```

약한 타입의 경우, 값 타입과 선언 타입의 공통된 속성이 있는지를 확인하는 검사를 진행하며, 이는 할당문마다 수행됩니다.

## 💻 extends

TypeScript에서 `A extends B`는 타입 '`A`는 타입 `B`의 서브 타입(부분 집합)이다' 로 해석할 수 있습니다.  
`extends`를 사용한 타입 상속의 예시를 살펴보겠습니다.

```typescript
// 0, boolean 타입은 never 타입(공집합)의 서브타입이 될 수 없습니다.
type A = boolean extends never ? 1 : 0;

// 1, true 리터럴 타입은 boolean 타입의 서브타입 입니다.
type B = true extends boolean ? 1 : 0;

// 1, never 타입은 모든 타입의 서브타입 입니다.
type C = never extends T ? 1 : 0;

// 1
type D = never extends never ? 1 : 0;

// 0, 0과 1의 유니온 타입은 리터럴 타입 0의 서브타입이 될 수 없습니다.
type E = 0 | 1 extends 0 ? 1 : 0;

// T가 literal 타입, literal 타입들의 union 타입, template literal 타입, string 타입일 경우만 1
type F = T extends string ? 1 : 0;
```

## 💻 unknown, any

`unknown`, `any` 타입은 임의의 JavaScript 값들을 의미합니다.

### 👨‍💻 unknown

`unknown` 타입은 TypeScript에서 타입들의 전체 집합을 의미합니다. 따라서 아래와 같은 특징을 가집니다.

```typescript
// 1, unknown은 모든 타입의 값들을 포함하는 전체 집합입니다.
type Y =
  | string
  | number
  | boolean
  | symbol
  | object
  | bigint
  | null
  | undefined extends unknown
  ? 1
  : 0;
```

`unknown` 타입 역시 모든 타입들을 모델링하고 있지는 않습니다. 따라서 `Exclude<unknown, string>`과 같은 타입은 `unknown`이 됩니다.

### 👨‍💻 any

`any` 타입은 집합이긴 하지만, 어떤 집합인지는 특정할 수 없는 타입입니다. 따라서 아래와 같은 특징을 가질 수 있습니다.

```typescript
// 1|0, any가 어떤 타입이냐에 따라 1이 될 수도, 0이 될 수도 있습니다.
type A = any extends string ? 1 : 0;

// 1|0, any가 never 타입일 경우 1, 다른 타입일 경우 0이 됩니다.
type B = any extends never ? 1 : 0;
```

또한 `any` 타입을 상속받는 `conditional type`들은 모두 참이 됩니다.
