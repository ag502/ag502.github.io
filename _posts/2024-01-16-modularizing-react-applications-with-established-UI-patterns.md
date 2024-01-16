---
title: Modularizing React Applications with Established UI Patterns 정리
date: 2024-01-16
categories: [react]
tags: [front-end, react]
---

## 💻 문제

`React` 와 같은 프론트엔드 개발도구는 뷰(`view`) 를 구성하는 도구이기 때문에, 원칙상 `view` 와 연관되어 있는 코드(`view code`) 만 존재해야 합니다. 하지만, `view` 와 연관되어 있지 않는 코드(`non-view code`) 가 존재하게 되면 서비스의 규모가 커짐에따라 가독성이 떨어지게 되고, 유지보수도 어려워 지게됩니다.

이를 방지하기 위해, 코드의 각 부분이 어떤 역할을 하는지 분석해야 합니다. 즉, `view code` 와 `non-view code` 를 분리하고, `non-view code` 를 책임에 따라 더욱 세분화해야 합니다.  
확장가능하고 유지보수가 용이한 코드를 작성하기 위해 원문에서 제시한 단계와, 해당 단계들을 적용해 리펙토링한 예시를 살펴보겠습니다.

## 💻 확장성있는 프론트엔드 애플리케이션을 구축하기 위한 단계

### 👨‍💻 단일 컴포넌트 애플리케이션(Single Component Application)

하나의 컴포넌트로 구성된 애플리케이션을 의미합니다.

![single-component-application.png](/assets/img/modularizing-react-applications-with-established-UI-patterns/single-component-application.png)

위 다이어그램에서 알 수 있듯이 하나의 컴포넌트에 네트워크 요청, 상태 관리, 도메인 로직이 모두 존재하고 있습니다. 이 경우, 컴포넌트에서 무슨 일이 일어나고 있는지 파악하는것이 어렵습니다.

### 👨‍💻 다중 컴포넌트 애플리케이션(Multiple Component Application)

단일 컴포넌트를 아래처럼 여러개의 컴포넌트로 분할한 컴포넌트를 의미합니다.
![multiple-component-application.png](/assets/img/modularizing-react-applications-with-established-UI-patterns/multiple-component-application.png)

하나의 컴포넌트를 분리하게되면 가독성이 좋아지게 됩니다.

### 👨‍💻 Hooks 을 이용한 상태 관리(State management with hooks)

네트워크 요청을 보내거나, `view` 에서 사용할 데이터를 변환하는 등의 로직은 `non-view code` 로 분류할 수 있습니다. 따라서, 컴포넌트와 같이 위치하는것이 적절하지 않습니다. `React` 의 경우 이런 로직들을 `hook` 을 사용해 UI 와 분리할 수 있습니다.

![state-management-with-hooks](/assets/img/modularizing-react-applications-with-established-UI-patterns/state-management-with-hooks.png)

추가로, 하나의 컴포넌트에 상태들이 많은 경우도 `hook` 을 이용해 컴포넌트로 부터 분리할 수 있습니다.

### 👨‍💻 비즈니스 모델의 등장(Business models emerged)

분리한 `hook` 을 살펴보면, 상태와 사이트이펙트를 제외한 로직들은 `react` 와 무관한 로직임을 알 수 있습니다.
따라서, 해당로직들을 따로 분리할 수 있고 결과를 다이어그램으로 나타내면 아래와 같습니다.

![business-models-emerged](/assets/img/modularizing-react-applications-with-established-UI-patterns/business-models-emerged.png)

분리한 도메인 로직들은 `non-view code` 이기 때문에, 상속 또는 다형성등과 같은 `OOP` 를 적용할 수 있습니다.
