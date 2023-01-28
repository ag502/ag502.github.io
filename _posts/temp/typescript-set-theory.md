# TypeScript Set Theory

## TypeScript와 집합과의 관계

TypeScript의 타입들을 JavaScript 값의 집합으로써 가정해보면

1. 전체집합(universe)은 JavaScript가 재공하는 값들
2. `A extends B` 는 A는 B의 부분집합이라고 읽을 수 있음
3. 유니온 타입(`|`)과 인터섹션 타입(`&`)은 각각 집합의 합집합, 교집합으로 생각할 수 있음
4. `Exclude<A, B>`는 차집합 (`A|B`)과 같음
5. `never`는 공집합과 같음. `A & never` (`A ⋂ ∅`) 은 `never`, `A | never` (`A ⋃ ∅`) 은 `A`, `Exclude<0, 0>` 은 (`0 ￨ 0`) `0`

## Boolean Type

JavaScript의 타입이 `Boolean` 밖에 없다고 가정(universe가 `Boolean`)해보면, 아래와 같이 표현할 수 있다

![d2](https://user-images.githubusercontent.com/35404137/215250652-e5d01188-b967-4ea5-9582-ab756969d087.svg)

- `boolean`은 `true | false`로 표현 가능하다
- `true`는 `boolean`의 부분집합(subset)이다.
- `never`는 공집합임으로 `true`, `false`, `boolean`의 부분집합(타입)이다. (공집합은 모든 집합의 부분 집합)
- `&` 은 교집합임으로 `false & true` 는 `never`, `boolean & true` 은 `true`, `true & never` 는 `never` 이다
- `|` 은 합집합임으로 `true | never` 는 `true`, `boolean | true` 는 `boolean` 이다
- `Exclude` 는 차집합임으로 `Exclude<boolean, true>` 는 `false` 이다

`boolean`과 관련한 `extends` 케이스는 아래와 같다.

```typescript
// boolean은 never의 부분타입이 아니므로 0
type A = boolean extends never ? 1 : 0; // 0

// true는 boolean의 부분타입이므로 1
type B = true extends boolean ? 1 : 0; // 1

// never는 모든 타입의 부분타입이므로 1
type C = never extends false ? 1 : 0; // 1

// 스스로는 스스로의 타입이므로 1
type D = never extends never ? 1 : 0; // 1
```

`null`과 `undefined`는 각각 하나의 값을 가지고 있다는 점을 제외하면 `boolean`과 같다

![d2](https://user-images.githubusercontent.com/35404137/215251230-ea204d90-3fa6-47ae-aa8c-251a299f4eac.svg)

위 그림을 참조해 보면, `never extends null`은 참이고, `null & boolean` 은 `never`이다.

## String과 그 외의 원시타입

`String` 타입의 경우, JavaScript의 모든 문자열을 위한 타입이며 각각의 문자열은 그것고 일치하는 리터럴 타입이 있다 (`const str: hi = hi`). 따라서 이론상으로는 `String` 타입에는 무한개의 부분 타입이 있다.

- `|`(유니온 타입)로 다음과 같은 유한한 `string` 타입을 만들수 있다.

```typescript
type Country = "de" | "us";
```

위 타입은 길이가 2 이상인 문자열과 같은 무한 집합에서는 동작하지 않는다.

- `template literal type`을 사용하면 무한한 `string` 타입을 만들수 있다.

```typescript
type V = `v${string}`;
```

위 타입은 v로 시작하는 모든 문자열을 나타내는 타입이다.

`union`과 `template literal type`을 함께 쓰면, 리터럴 타입을 필터링할 수 있다.

```typescript
type F = "a" | ("b" & `a${string}`); // a
```

하지만 `template literal type`을 아래와 같이 합치지는 못합니다.

```typescript
type G = `a${string}` & `b${string}`;
```

위 타입에 해당하는 문자열은 없으므로 `never`와 같습니다.

몇몇 `string` 타입들은 TypeScript에서 사용할 수 없습니다.

```typescript
type H = Exclude<string, "a">;
```

지금까지 살펴본 내용을 적용해 보면 위 타입은 `string`타입에 `a` 리터럴 타입을 제외시킨 타입입니다.
하지만 추론된 타입을 살펴보면 `string`으로 평가된다. 그 이유는 `string` 타입이 모든 가능한 리터럴 타입의 합집합을(union) 모델링하고 있지 않기 때문이다.

`number`, `symbol`, `bigint` 와 같은 다른 원시타입들도 `template literal type`을 제외하고는 `string` 타입과 동일하게 동작합니다.

![d2](https://user-images.githubusercontent.com/35404137/215253645-08251084-50b2-4aa9-8a38-e3b0e1ab09b7.svg)

## interfaces & objects types

```typescript
type Sum9 = { sum: 9 };
```

위와 같은 타입이 `{sum: 9}`의 값을 가진 객체를 위한 `literal type` 처럼 동작할 것을 기대하지만 실제로는 그렇지 않다. `Sum9` 타입은 `sum` 프로퍼티에 접근해 `9`라는 값을 얻을 수 있다는 뜻이다. (조건이나, 제한과 같은 느낌)

```typescript
function getNumber(data: Sum9) {
  return data.sum;
}

const obj = { sum: 9 as const, date: "2022-09-13" };

getNumber(obj);
```

`{}`은 JavaScript 리터럴 `{}`과 일치하는 빈 객체를 나타내는 타입이 아니라, 프로퍼티들에 접근할 수 있지만, 어떤 프로퍼티인지는 상관없다는 뜻이다.  
예를들어 `x=9`의 경우 `x['whatever']`의 형식으로 프로퍼티에 접근할 수 있고 이는, `{}` 인터페이스를 만족한다. 사실 `const x: {toString(): string} = 9`도 가능하다. `x.toString()`으로 문자열을 얻을 수 있기 때문이다. `null` 과 `undefined`는 어떤 프로퍼티도 접근할 수 없기 때문에 `{}` 인터페이스를 만족하지 않는다.

`|`, `&`으로 돌아와서, 두 연산은 집합에 대한 연산이지 객체의 값과 관련된 연산이 아니다. 따라서 `{name: string} & {age: number}` 는 `name`과 `age`를 가지고 있는 객체를 의미한다.

![d2](https://user-images.githubusercontent.com/35404137/215263524-15a64053-2dc3-4600-8569-f109cc396258.svg)

## extends

`A extends B`는 `A`는 `B`의 서브 타입이다로 해석할 수 있다.

- `0 | 1 extends 0`은 거짓이다. `{0, 1}`이 `{0}`의 부분집합이 아니기 때문이다.
- `never extends T`는 항상 참이다. `never`는 공집합으로 모든 타입의 부분 타입이기 떄문이다.
- `T extends never`는 `T`가 `never`일 경우에만 참이다. 공집합은 공집합만을 부분집합으로 갖기 때문이다.
- `T extends string`는 `T`가 `string`, `literal`, `literal union`, `template` 일 경우 참이다.

## unknown and any

TypeScript는 임의의 JavaScript값을 나타내는 두개의 타입 `unknown`, `any`가 있다. 일반적인 것은 JS 값의 전체집합인 `unknown` 이다.

```typescript
type Y =
  | string
  | number
  | boolean
  | object
  | bigint
  | symbol
  | null
  | undefined extends unknown
  ? 1
  : 0; // 1

type Y2 = {} | null | undefined extends unknown ? 1 : 0; // 1

type N = unknown extends string ? 1 : 0; // 0
```

주의할점은

- `unknown`은 모든 다른 기본타입의 합집합이 아니므로 `Exclude<unknown, string>`은 성립하지 않는다.
- `unknown extends string | number | boolean | bigint| symbol | object | null |undefined` 는 거짓이다. `enum`과 같은 타입이 빠졌기 때문이다.

`unknown`의 경우는, 모든 가능한 JavaScript 값의 집합이라고 생각하면 편하다.

`any`의 경우는 특이한데

- `any extends string ? 1 : 0`은 `1|0` 으로 평가된다.
- `any extends never ? 1 : 0`도 `1|0` 으로 평가된다

`any`는 집합이긴 하지만, 어떤 집합인지는 특정할 수 없다고 결론내릴 수 있다.

`string extends any`, `unknown extends any`, `any extends any` 모두 참이다.

![d2](https://user-images.githubusercontent.com/35404137/215265217-857481d8-6c12-45b6-a565-4e4504d54e00.svg)
