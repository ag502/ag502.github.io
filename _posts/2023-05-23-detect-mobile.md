---
title: 웹뷰에서 모바일 기기 판별하기
date: 2023-05-23
categories: [JavaScript]
tags: [JavaScripts]
---

## 💻 개요

모바일 웹을 구현하다 보면, 현재 사용자가 모바일 기기로 접속했는지를 판별해 분기처리를 해야하는 경우가 생깁니다.
이 때 사용할 수 있는 네가지 방법을 살펴보겠습니다.

## 💻 userAgent

가장 많이 알려져 있고, 또 가장 많이 사용하는 방법은 `navigator.userAgent`를 사용하는 것 입니다.

```javascript
console.log(navigator.userAgent);
// Mac으로 접속시
// Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36

// iPhone으로 접속시
// Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1
```

`navigator.userAgent`를 정규식으로 파싱하는 방식을 통해 사용자가 접속한 기기를 판별할 수 있습니다.

하지만 이 방식은 두가지 문제점이 있습니다.

첫번째 문제는 사용자가 임의로 변경가능하다는 점입니다. 아래 예시처럼 `Object.defineProperty`를 통해 `userAgent`를 변경할 수 있습니다.

```javascript
Object.defineProperty(navigator, "userAgent", { value: "Nothing" });

console.log(navigator.userAgent); // Nothing
```

두번째 문제는 iPad의 `userAgent` 값이 Mac의 `userAgent` 값과 동일하게 출력된다는 점입니다.

```javascript
console.log(navigator.userAgent);

// iPad로 접속시
// Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15
```

## 💻 ontouchstart

`ontouchstart` 이벤트의 존재 여부를 판별함으로써 모바일 기기의 여부를 알 수 있습니다.

```javascript
console.log("ontouchstart" in document.documentElement);

// 모바일 기기일 경우 true, 아닐 경우 false
```

하지만 이 방법 또한 문제점이 있습니다. 노트북 중 터치를 지원하는 노트북의 경우에는 위 값이 `true`로 출력된다는 것이 그 문제입니다.

## 💻 window.orientation

`orientation` 객체의 존재 여부를 통해 모바일 기기를 판별할 수도 있습니다.

```javascript
console.log(typeof window.orientation === "undefined");

// 모바일 기기일 경우 false, 아닐 경우 true
```

이 방법의 문제점은 [`window.orientation`가 deprecated 될 예정](https://developer.mozilla.org/en-US/docs/Web/API/Window/orientation) 이여서 사용이 권장되지 않는다는 점입니다.  
대안으로 제안하고 있는 `screen.orientation`은 Desktop에서도 지원하고 있어 모바일 기기를 판별하기 위해 사용하지는 못합니다.

## 💻 window.matchMedia()

`matchMedia`는 `MediaQueryList` 객체를 반환하는 함수로, `document`가 `media query`와 일치하는지를 판단할 때 사용합니다.

```javascript
console.log(window.matchMedia("(max-width: 768px)").matches);

// 768px보다 클 경우 false, 아닐 경우 true
```

위 예시처럼 화면 크기를 통해 판단할 수도 있지만 포인팅 장치를 통해 파악할 수도 있습니다.

```javascript
console.log(window.matchMedia("pointer: coarse").matches);
```

`pointer: coarse`는 터치스크린의 손가락과 같이 정확도가 제한된 기본 포인팅 장치를 의미합니다.

하지만 `pointer: coarse`는 기본 포인팅 장치만을 의미함으로 터치 가능한 노트북에서는 `false`를 반환합니다. 이때는 `any-pointer: coarse`를 사용하여 여러 포인팅 장치 중 적어도 하나가 해당 특성을 만족하는지를 판별하면 됩니다.
