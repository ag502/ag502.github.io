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
