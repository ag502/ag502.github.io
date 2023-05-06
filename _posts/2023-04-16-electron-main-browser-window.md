---
title: 일렉트론 Main Process - Browser Window
date: 2023-04-16
categories: [electron]
tags: [electron]
image:
  path: /assets/img/electron-main.jpeg
  alt: electron logo
---

`Main Process`에서 `browser window(renderer process, 창)`를 생성하고 제어하는 역할을 합니다. `browser window`는 `app`의 `ready` 이벤트가 실행되기 전까지 생성될 수 없습니다. 또한 `app` 모듈과 같이 `Event Emitter`를 상속 받았기 때문에 다양한 이벤트들을 수신할 수 있습니다. `BrowserWindow`에서 사용하는 함수들과 이벤트들을 살펴보겠습니다.

## 💻 생성

`BrowserWindow` 클래스의 인스턴스를 생성 함으로써 `browser window`를 만들 수 있습니다. 인스턴스 생성시에 생성자에는 `window`의 특성을 설정할 수 있는 [옵션들](https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions)을 넘겨줄 수 있습니다.

```javascript
const { app, BrowserWindow } = require("electron");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
  });
}

app.whenReady().then(() => {
  createWindow();
});
```

위 코드는 `1000 x 800` 크기의 `window`를 생성하는 코드 입니다.

## 💻 loadURL

`browser window`에 표시할 컨텐츠를 `url`을 통해 로드할 수 있는 함수입니다.  
함수의 결괏값으로 `promise`를 반환하는데 로딩에 성공하면 `resolve`되며 실패할 경우 `reject` 됩니다.  
함수에 전달하는 인자는 `url`외에도 [여러 옵션들](https://www.electronjs.org/docs/latest/api/browser-window#winloadurlurl-options)이 있습니다.

```javascript
function createWindow() {
  mainWindow = new BrowserWindow({
    // ... 옵션들
  });

  mainWindow.loadURL("http://localhost:3000");
}
```

## 💻 loadFile

`browser window`에 표시할 컨텐츠를 파일로 부터 받아오는 함수입니다.

```javascript
function createWindow() {
  mainWindow = new BrowserWindow({
    // ... 옵션들
  });

  mainWindow.loadFile("./index.html");
}
```

#### 🖊 loadURL vs loadFile

> 두 함수 모두 `window`에 로드될 컨텐츠를 불러온다는 공통점이 있지만, 불러오기위해 접근하는 곳이 다릅니다.  
>  `loadURL`의 경우 명시한 `URL`에 접근해 해당 페이지를 불러오며, `loadFile`은 로컬 파일에 접근해 불러옵니다. 따라서 `loadFile`의 컨텐츠 로드 속도가 `loadURL`보다 빠릅니다.

## 💻 ready-to-show

`renderer process`가 `window`에 로드할 컨텐츠를 모두 렌더링하면 트리거 되는 이벤트 입니다.  
해당 이벤트를 이용하면, 컨텐츠 로드에 시간이 소요되는 상황에서 `window`에 빈 화면이 노출되었다가 컨텐츠가 로드되는 visual-flash(깜빡임) 효과를 막을 수 있습니다.

```javascript
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}
```

위 코드에서 `BrowserWindow`에 절달해준 `show` 옵션은 `window`를 생성하자마자 노출 시킬것인지를 설정해주는 옵션입니다. 해당 옵션을 `false`로 설정했으니 명시적으로 `show` 함수를 호출해 `window`를 노출 시켜야 합니다.  
처음에는 `window`를 노출시키지 않다가 `ready-to-show` 이벤트가 트리거 된 후에 `window`를 노출 시킴으로써 깜빡임 현상을 막을 수 있습니다.

#### 🖊 `did-finish-load`와의 관계

> 아래에서 살펴볼 `WebContent`에서 수신하는 이벤트로 로드할 컨텐츠가 로컬에 존재하는 파일이라면 (`loadFile`) 해당 이벤트 트리거 이후에 `ready-to-show` 이벤트가 발생하며, 원격 리소스라면(`loadURL`) 해당 이벤트 트리거 이전에 발생합니다.

#### 🖊 `backgroundColor` property

> `browser window`의 배경색을 지정할 수 있는 옵션입니다.  
> 해당 옵션을 통해 `window`의 배경색을 컨텐츠의 배경색과 동일하게 지정함으로써 깜빡임이 일어나지 않는것 처럼 보이게 하는 트릭을 사용할 수 있습니다. 공식 문서에서는 더 자연스로운 UX를 위해 `ready-to-show` 이벤트를 사용하고 있더라도 `backgroundColor`를 컨텐츠와 동일한 색으로 지정하기를 [권장](https://www.electronjs.org/docs/latest/api/browser-window)하고 있습니다.

## 💻 Parent and Child Window

`window` 간의 부모, 자식관계를 설정할 수 있습니다. Child `window`는 항상 Parent `window`위로 올라갑니다. Parent `window`가 움직이면 Child `window`는 같이 움직이며 부모 `window`가 닫히면 자식 `window`역시 닫히게 됩니다.

```javascript
let mainWindow = null;
let secondaryWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
  });

  secondaryWindow = new BrowserWindow({
    width: 400,
    height: 300,
    parent: mainWindow,
  });
}
```

## 💻 Frameless Window

`BrowserWindow`의 옵션중 `frame`을 `false`로 설정하면 프레임이 없는 (`frameless`) `window`를 생성할 수 있습니다. `frameless window`는 드래그 할 수 없다는 특징이 있습니다.  
이를 해결하기 위해서는 로드되는 컨텐츠 `html` 태그에 특정 `css`속성을 지정해주어야 합니다.

```javascript
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
  });
}
```

```html
<body style="user-select: none; -webkit-app-region: drag;">
  <!--  -->
</body>
```

위와 같이 `body` 태그에 스타일을 지정해 주면 `frameless window`를 움직일 수 있습니다. 하지만 위 방법에는 한가지 문제가 있습니다. 만약 `body` 태그안에 `<input type="range"/>`와 같은 드래그 요소가 있을 경우 정상적으로 동작하지 않습니다. 따라서 해당 태그에는 아래와 같이 추가적인 스타일을 적용해 주어야 합니다.

```html
<input
  type="range"
  name="range"
  min="0"
  max="10"
  style="
    -webkit-app-region: no-drag"
/>
```

#### 🖊 titleBarStyle

> `window`의 `title bar` 스타일을 지정할 수 있는 옵션입니다. OS에 따라 적용된 모습이 다릅니다.

## 💻 기타 설정들

### 🙋‍♂️ minWidth/minHeight

`window`의 최소 너비와 높이를 설정하는 속성입니다.  
기본값은 0이며 값을 지정하게되면, 해당 값 이하로 줄어들지 않습니다.

```javascript
createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 500,
    minHeight: 500
  })
}
```

위 예시는 창 크기가 최소 `500 x 500` 인 `window`를 만드는 코드입니다.

### 🙋‍♂️ resizable

해당 옵션으로 `window`의 크기 조절 여부를 지정할 수 있습니다.

### 🙋‍♂️ movable

`window`를 움직일 수 있는지 여부를 결정하는 옵션입니다.

### 🙋‍♂️ minimizable/maximizable

최소화, 최대화 가능 여부를 결정하는 옵션입니다.

## 💻 Event

`browser window`가 수신하는 이벤트는 `app`과 달리 이벤트 리스너를 설정한 `window`만 이벤트를 수신한다는 차이점이 있습니다.

```javascript
let mainWindow = null;
let secondaryWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow();
  secondaryWindow = new BrowserWindow();

  mainWindow.on("focus", () => {
    console.log("focus");
  });
}
```

위 예시에서 `mainWindow`에 `focus` 이벤트의 리스너를 설정해주었습니다. 따라서 `mainWindow`가 `focus` 되었을 때만 해당 이벤트를 수신합니다.

## 💻 state management

[electron-window-state](https://www.npmjs.com/package/electron-window-state)를 사용하면 `browser window`의 상태를 저장할 수 있습니다.

```javascript
const windowStateKeeper = require("electron-window-state");

let mainWindow = null;

function createWindow() {
  // 이전에 저장된 상태들 로드 (없을경우 default 값으로 대치)
  const mainWindowState = windowStateKeeper({
    defaultWindow: 1000,
    defaultWindow: 800,
  });

  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
  });

  // window의 상태가 변경될 때마다 자동으로 저장
  mainWindowState.manage(mainWindow);
}

app.whenReady().then(() => createWindow());
```

## 💻 WebContents

`WebContents` 인스턴스는 `BrowserWindow`안에 로드되는 컨텐츠로 생각할 수 있습니다. 다시말해 `BrowserWindow`는 컨텐츠가 로드될 `chromium` browser 인스턴스를 생성하고 `WebContents` 인스턴스는 `BrowserWindow` 안에 들어갈 컨텐츠를 화면에 그리고 제어합니다.

`WebContents`는 `BrowserWindow` 객체의 프로퍼티이며, `EventEmitter`를 상속받아 이벤트를 수신할 수 있습니다.

```javascript
const { BrowserWindow } = require("electron");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 1500,
  });

  mainWindow.loadURL("https://github.com");

  const mainContent = mainWindow.webContents;

  console.log(mainContent);
}
```

### 🙋‍♂️ Event

#### 👨‍💻 did-finish-load

navigation이 완전히 완료되었을 때, 트리거되는 이벤트 입니다. 해당 이벤트가 트리거 된 후 `BrowserWindow`의 `loadFile`과 `loadURL`의 `promise`가 `resolve`됩니다.

##### 🖊 dom-ready

> `dom-ready` 이벤트는 `dom`이 로드 되었을때 트리거 되는 이벤트로 `did-finish-load` 이벤트와는 차이가 있습니다.
> `img` 태그를 사용해 사진을 로딩한다고 가정해보겠습니다. `img` 태그가 `WebContents`에 로드되었을때 `dom-ready` 이벤트가 트리거 되며, 태그에 불러오고자 하는 이미지가 로드될때 `did-finish-load`가 트리거 됩니다.

#### 👨‍💻 did-create-window

외부 링크로 새로운 `window`가 생성될 때 트리거되는 이벤트 입니다.

```html
<a href="https://picsum.photos/id/237/200/300" target="_blank">new window</a>
```

```javascript
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
  });

  const ws = mainWindow.webContents;

  ws.on("did-create-window", (window, details) => {
    // BrowserWindow
    console.log(window);
    // Objec
    console.log(details);

    console.log(`open new window url ${details.url}`);
  });
}
```

만약 아래에서 살펴볼 `setWindowOpenHandler`의 설정에 의해 `window`가 생성되지 않는다면, 해당 이벤트는 트리거되지 않습니다.

#### 👨‍💻 will-navigate

새로운 링크로 이동(navigate)하기 전에 트리거되는 이벤트 입니다.  
`window.location` 객체가 변경되거나 사용자가 페이지내의 링크를 클릭했을때 발생하지만, `webContents.loadURL`나 `webContents.back` 와 같은 API를 사용해 프로그래밍적으로(programmatically) 이동한 경우 발생하지 않습니다. 또한 `a` 태그를 사용해 페이지 내에서의 이동이나, `window.location.hash` 가 변경된 경우도 발생하지 않습니다. 이 경우에는 `did-navigate-in-page` 이벤트를 사용해야 합니다.

```javascript
const ws = mainWindow.webContents;

ws.on("will-navigate", (event, url) => {
  event.preventDefault();
  console.log(url);
});
```

위 예시와 같이 `event.preventDefault()`를 호출할 경우, 이동하지 않습니다.

#### 👨‍💻 did-start-navigation

링크를 클릭하자마자 트리거 되는 이벤트 입니다.

#### 👨‍💻 render-process-gone

`renderer process`가 예기치 않게 종료되었을 때 트리거 되는 이벤트 입니다.

```javascript
ws.on("render-process-gone", (event, details) => {
  console.log(event);
  console.log(details.reason);
  console.log(details.exitCode);
});
```

#### 👨‍💻 before-input-event

`keyup`, `keydown` 이벤트가 발생하기 전에 트리거 되는 이벤트 입니다.

```javascript
const ws = mainWindow.webContents;

ws.on("before-input-event", (event, input) => {
  console.log(`${input.key} ${input.type}`);
});
```

#### 👨‍💻 media-started-playing / media-paused

`WebContents`에 있는 미디어가 재생을 시작하거나 정지 및 재생이 끝났을 때 트리거 되는 이벤트 입니다.

#### 👨‍💻 context-menu

마우스 우클릭시 발생하는 이벤트 입니다.

```javascript
const ws = mainWindow.webContents;

ws.on("context-menu", (event, params) => {
  console.log(
    `Context menu opened on: ${params.mediaType} at x: ${params.x}, y:${params.y}`
  );
});
```

### 🙋‍♂️ Instance Method

#### 👨‍💻 setWindowOpenHandler

`window.open()` 이나 `target="_blank"`, `shift + click` 등으로 새로운 `browser`를 생성하기전에 호출되는 함수 입니다.  
반환값은 아래와 같으며 `{action: "deny"}`일 경우 새로운 `browser`가 열리지 않습니다.

```javascript
{action: 'deny'} | {action: 'allow', outlivesOpener?: boolean, overrideBrowserWindowOptions?: BrowserWindowConstructorOptions}

```

```javascript
ws.setWindowOpenHandler((details) => {
  console.log(details);

  return { action: "deny" };
});
```
