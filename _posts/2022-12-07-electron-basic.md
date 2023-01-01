---
title: 일렉트론 기초
date: 2022-12-07
categories: [electron]
tags: [electron]
image:
  path: /assets/img/electron-main.jpeg
  alt: electron logo
---

## 💻 일렉트론이란?

일렉트론은 chromium과 node.js를 기반으로 만들어진 프레임워크로 JavaScript, HTML, CSS를 이용하여 여러 OS(Window, macOS, Linux)에서 동작하는 에플리케이션을 만들수 있습니다.

## 💻 설치 및 실행 방법

일렉트론을 전역 (--g) 또는 프로젝트에 로컬로 설치한 후 `electron .` 명령어로 실행할 수 있습니다.
아래는 npm으로 프로젝트를 생성한 후 electron을 로컬로 설치 한 `package.json` 의 일부분 입니다.

```json
{
  "name": "electron-app",
  "version": "1.0.0",
  "main": "main.js", // main process의 진입점
  "scripts": {
    "start": "electron ."
  }
}
```

보통의 웹 프로젝트에서 크게 신경쓰지 않았던 `main` 프로퍼티가 일렉트론에서는 중요합니다. `main process` 의 진입점이 되는 파일을 설정해 주어야 정상 적으로 실행할 수 있습니다. `Main process` 가 무엇인지는 아래에서 살펴 보겠습니다.
`version` 프로퍼티는 자동 업데이트 기능을 구현할 때 필요한 정보 입니다.

## 💻 일렉트론의 앱 구조

일렉트론은 크게 두가지 프로세스를 가지고 있습니다. 하나는 `main process` 이고 다른 하나는 `renderer process` 입니다.
각각의 프로세스가 무엇이며 어떤 역할을 하는지 알아보기 전에 chromium을 사용하는 크롬 브라우저의 구조를 먼저 살펴 보겠습니다.

![chrome process](/assets/img/basic-electron/chrome-process.png)
_출처: electron 공식 문서_

위 이미지는 크롬 브라우저의 프로세스 모델을 나타낸 것입니다.

브라우저가 단일 프로세스로 설계되었을 경우 오버헤드는 줄일 수 있지만, 여러 탭을 띄운 상황에서 하나의 탭이 오작동 할 경우 다른 탭에도 영향을 미칠 수 있는 단점이 있습니다. 이 문제를 해결하기 위해 위 이미지와 같이 각 탭마다 프로세스들이 존재하고 이 프로세스들을 메인 프로세스가 관리하는 방식으로 설계되었습니다. 이 경우에는 탭하나가 동작을 멈춰도 프로세스가 분리되어 있기 때문에 다른 탭들은 정상적으로 동작할 수 있습니다.

일렉트론의 프로세스도 이와 유사한 구조 입니다. 크롬 브라우저에서 탭을 관리하는 프로세스의 역할을 `renderer process` 가, 탭 프로세스들을 관리하는 프로세스의 역할을 `main process` 가 수행합니다. 각각의 특징은 아래와 같이 정리할 수 있습니다.

- Main Process  
  에플리케이션에서 단 하나만 존재  
  애플리케이션의 window들을 관리
  `Node.js` 환경에서 동작

- Renderer Process  
  `Main Process` 에 의해 여러개 생성될 수 있음  
  View(html/css...)단을 담당

![electron process](/assets/img/basic-electron/electron-process.png)

## 💻 디버깅 방법

프로세스에 따라 디버깅 방법이 다릅니다.

- Main Process  
  `electron --inspect=5858 .` 명령어를 실행하면 해당 포트로 웹소켓이 연결됩니다.  
  `chrome://inspect`의 Devices 탭에서 `localhost:5858`을 추가해 디버깅할 수 있습니다.
  만약 시작과 동시에 디버깅을 하고 싶다면 `electron --inspect-brk=5858 .` 명령어를 실행하면 됩니다.
- Renderer Process  
  `Renderer Process`의 경우 개발자 도구를 열어 디버깅할 수 있습니다.

  ```js
  mainWindow.webContents.openDevTools();
  ```
