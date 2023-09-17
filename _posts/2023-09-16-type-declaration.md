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

## 💻 타입 선언 파일 모듈화

## 💻 DefinitelyTyped / `@types`

## 💻 Ambient Declarations

### 👨‍💻 Ambient Namespace

### 👨‍💻 Ambient Module

## 💻 3rd Party Library Custom Type Definition

#### 📗 참고자료

[Type Declarations](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html)  
[TypeScript Ambients Declaration](https://www.geeksforgeeks.org/typescript-ambients-declaration/)  
[AMBIENT NAMESPACES IN DECLARATION FILES](https://lukasznojek.com/blog/2020/02/typescript-declaration-files/)  
[TypeScript Ambient Module](https://elfi-y.medium.com/typescript-ambient-module-8816c9e5d426)
