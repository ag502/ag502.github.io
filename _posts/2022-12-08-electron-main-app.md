---
title: 일렉트론 Main Process - app
date: 2022-12-08
categories: [electron]
tags: [electron]
image:
  path: /assets/img/electron-main.jpeg
  alt: electron logo
---

## 💻 app 모듈

`Main Process`에 다음과 같이 임포트해서 사용가능 하며, 애플리케이션의 생명 주기를 관리하는 역할을 합니다.

```js
const { app } = require("electron");
```

Node.js의 Event Emitter를 상속받았기 때문에 이벤트들을 수신해 적절한 로직을 실행할 수 있습니다. `app` 모듈에서 수신하는 이벤트와 함수들 몇가지를 살펴 보겠습니다.

## 💻 ready

```js
app.on("ready", (event, lauchInfo) => {
  //
});
```

일렉트론의 초기화가 완료 되었을 때, 딱 한번 실행되는 생명주기 입니다. 대부분의 일렉트론 로직은 이 이벤트가 트리거 된 후 실행되게끔 작성됩니다.  
애플리케이션 실행 환경이 `macOS`라면 `launchInfo` 인자를 받아올 수 있으며, 알림 센터를 통해 실행했을 경우 해당 인자가 넘어오게 됩니다.  
위 이벤트와 관련되어 있는 함수 두가지를 소개하겠습니다.

```js
// "ready" 이벤트가 트리거 되었는지 여부를 확인
app.isReady();

// "ready" 이벤트가 트리거 되었을 때 promise를 반환
/**
 * .on("ready", () => {}) 와 같은 역할이지만
 * 위 함수를 사용했을 때, 발생할 수 있는 사이드 이펙트를 줄일 수 있음
 * https://github.com/electron/electron/pull/21972
 */
app.whenReady().then(() => {
  //
});
```

## 💻 before-quit

```js
app.on("before-quit", (event) => {
  //
});
```

애플리케이션이 종료되기 직전에 트리거되는 이벤트입니다. `e.preventDefault()`를 추가한 후 종료를 하게 되면, 이벤트는 트리거되지만 애플리케이션은 종료되지 않습니다.

## 💻 browser-window-blur

```js
app.on("browser-window-blur", (event, window) => {
  setTimeout(() => {
    app.quit();
  }, 3000);
});
```

`browserWindow`가 blur 즉 포커스를 잃었을 때, 트리거되는 이벤트 입니다. 위 로직은 `browserWindow`의 포커스가 사라진 후, 3초 후에 애플리케이션이 종료되도록 하는 로직입니다.

## 💻 browser-window-focus

```js
app.on("browser-window-focus", (event, window) => {
  //
});
```

`browser-window-blur`와 반대의 경우 트리거되는 이벤트 입니다.

## 💻 getAppPath()

현재 애플리케이션의 경로를 불러오는 함수 입니다.

## 💻 getPath(name)

`name`에 해당하는 경로를 불러오는 함수입니다. 사용자의 홈 디렉토리(home), 문서 폴더(document)등의 경로를 불러올 수 있습니다.  
경로의 이름은 [electron 문서](https://www.electronjs.org/docs/latest/api/app#appgetpathname)에서 확인할 수 있습니다.

## 💻 quit()

모든 창들을 닫게하는 이벤트 입니다. 해당 함수를 실행하면, `before-quit`이벤트가 먼저 실행되고, 모든 창이 성공적으로 종료되면 `will-quit` 이벤트가 실행됩니다.

`quit` 메소드가 실행되면 `beforeunload` 와 `unload` 이벤트도 정상적으로 실행됩니다. 만약 `beforeunload`가 `false`를 리턴하게 하면 종료되지 않습니다.
