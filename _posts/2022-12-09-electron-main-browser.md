---
title: 일렉트론 Main Process - Browser Window
date: 2022-12-09
categories: [electron]
tags: [electron]
image:
  path: /assets/img/electron-main.jpeg
  alt: electron logo
---

## 💻 BrowserWindow 란?

`Main Process`에 아래와 같이 임포트해서 사용하는 클래스 모듈입니다.

```js
const { BrowserWindow } = require("electron");
```

`BrowserWindow`의 인스턴스를 생성하는 것은 `renderer process`를 생성하는 것과 같으며, 애플리케이션 창(window)을 생성하고 컨트롤하는 역할을 합니다. 그 외에도 외형을 바꾸는 여러설정을 지정할 수 있는 옵션들도 있습니다. 한가지 주의할 점은 반드시 `app`이 준비된 후에('ready') 해당 모듈을 사용해야 한다는 것입니다.

`BrowserWindow`가 지원한는 이벤트들과 옵션값 그리고 메소드들을 몇가지 살펴보겠습니다.

## 💻 loadURL vs loadFile

```js
win.loadURL("https://naver.com");
win.loadFile("./index.html");
```

`BrowserWindow`에 그릴 뷰를 지정할 수 있는 함수 입니다.  
해당 window에 특정 URL의 웹 페이지를 표시하고 싶다면 `loadURL`을, 특정 파일을 콘텐츠로 표시하고 싶다면 `loadFile`을 사용합니다. 두 함수 모두 `Promise`를 리턴하며 로딩이 성공했을 때 resolve(`did-finish-load`), 실패했을 경우 reject(`did-fail-load`)를 반환합니다.  
차이점은 `loadURL`의 경우 실제 네트워크 통신을 통해 컨텐츠를 불러오는 방식이기 때문에, `loadFile` 방식보다 느릴 수 있습니다.

## 💻 ready-to-show

```js
const { BrowserWindow } = require("electron");
const win = new BrowserWindow({ show: false });
win.once("ready-to-show", () => {
  win.show();
});
```

Window가 아직 나타나지는 안았지만, 렌더링은 끝났을 때, 해당 이벤트가 트리거 됩니다. 보통 `did-finish-load` 이벤트 후에 트리거 되지만, 원격으로 받아오는 리소스가 많을 경우 전에 트리거 될 수도 있습니다.

### 🖊 `ready-to-show`를 사용하면 flicking 현상을 방지할 수 있습니다.

아래의 예시는 `html` 태그에 `background-color: black;` 속성을 지정한 html 파일을 `loadFile`을 통해 로딩한 예시입니다.

![flicking](/assets/img/main-browser/flicking.gif)

초기에 흰 배경의 일렉트론 프레임이 나타난 후 html 파일이 로딩된 모습입니다. 이 현상을 해결하기 위해 처음에 소개했던 코드와 같이, `BrowserWindow`의 show 옵션을 `false`로 지정한 후 `ready-to-show` 이벤트에서 `show()` 함수를 실행하면 해당 현상을 방지할 수 있습니다.

### 🖊 backgroundColor 속성

Flicking 현상을 방지하기 위한 다른 방법으로는 `backgroundColor`를 지정하는 것입니다. 로딩해야하는 리소스가 많은 애플리케이션의 경우 `ready-to-show` 이벤트가 늦게 트리거 될 수 있습니다. 이 경우 처음 소개했던 방법을 적용하게 되면, window가 늦게 나타나 UX적인 측면에서 부정적인 영향을 끼칠 수 있습니다.  
따라서 window의 배경색을 로딩하고자하는 페이지의 배경색과 동일하게 지정해 flicking 현상을 막는 트릭을 사용할 수 있습니다.

```js
const { BrowserWindow } = require("electron");
const win = new BrowswerWindow({ backgroundColor: "#2e2c29" });
win.loadURL("https://github.com");
```

![unflicking](/assets/img/main-browser/unflicking.gif)

## 💻 Parent Browser vs Child Browser

```js
const { BrowserWindow } = require("electron");

const mainWindow = new BrowswerWindow({
  width: 1000,
  height: 800,
});

const secondaryWindow = new BrowswerWindow({
  width: 600,
  height: 300,
  parent: mainWindow,
});

mainWindow.loadURL("https://github.com");
secondaryWindow.loadURL("https://naver.com");
```

`Parent` 옵션을 사용하면 window간의 계층구조를 설정할 수 있습니다.  
위 예시에서 `secondaryWindow`는 `mainWindow`의 자식입니다. 이 경우 `secondaryWindow`는 독립적으로 움직이고 닫을 수 있지만, 부모인 `mainWindow`를 움직이거나 닫을 때, `secondaryWindow`도 똑같이 동작합니다.

## 💻 Modal

```js
const { BrowserWindow } = require("electron");

const mainWindow = new BrowserWindow({
  width: 1000,
  height: 800,
});

const secondaryWindow = new SecondaryWindow({
  width: 600,
  height: 300,
  modal: true,
});
```

`Modal`은 `child browser`의 한 종류 입니다.  
단 `modal`의 경우 항상 `parent browser`의 위에 존재하기 때문에 `parent browser`를 사용할 수 없습니다.

## 💻 frameless window

```js
const { BrowserWindow } = require("electron");

const mainWindow = new BrowserWindow({
  width: 1000,
  height: 800,
  frame: false,
});
```

`frame` 속성을 `false`로 설정해 window의 프레임을 없앨 수 있습니다. 위 코드를 실행한 결과는 아래와 같습니다.

![!frameless](/assets/img/main-browser/frameless.png)
해당 속성을 활성화 시키면 window의 상단 바(bar)가 사라지게 됩니다. 이 옵션이 활성화 되면 window의 드래그가 불가능하게 됩니다. 아래와 같은 스타일을 적용하면 window를 드래그 되게끔 설정할 수 있습니다.

```css
body {
  user-select: none;
  -webkit-app-region: drag;
}
```

해당 스타일을 적용할 때의 문제점은, 위 스타일로 인해 드래그가 필요한 태그가 드래그 되지 않는 다는 것 입니다. 이때에는 해당 태그에 추가적인 스타일을 지정해 주어야 합니다.

```css
[tag] {
  -webkit-app-region: no-drag;
}
```

## 💻 titleByStyle

```js
const { BrowserWindow } = require("electron");
const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  titleBarStyle: "hidden",
});
```

해당 옵션의 값을 설정하게 되면 window의 제목 표시줄을 커스텀할 수 있습니다. 이 옵션의 경우 OS에 따라 나타나는 모습이 다릅니다.
