# JavaScript Engine

## 💻 JavaScript Engine 이란?

![js-to-computer](/assets/img/temp/js-to-computer.png)

위 그림에서 볼 수 있듯이 `JavaScript Engine`은 개발자가 작성한 `JavaScript` 코드를 컴퓨터가 이해할 수 있는 언어로 바꿔주는 역할을 합니다.
우리가 작성한 코드는 컴퓨터가 알아 듣지 못하기 때문에 engine이 필요합니다.  
`JavaScript Engine`의 [종류](https://ko.wikipedia.org/wiki/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8_%EC%97%94%EC%A7%84)는 많지만 구글에서 만든 V8엔진이 대표적이므로 이에 대해 살펴보겠습니다.

## 💻 V8 엔진

![v8-engine](/assets/img/temp/v8-engin.png)

위 그림은 V8 엔진의 내부 동작을 표현한 모식도 입니다. `JavaScript`코드를 읽은 후 컴퓨터가 이해할 수 있는 언어로 바꿀때까지의 각 단계를 살펴보겠습니다.

### 👨‍💻 Parser → AST

모식도에서는 ⓵에 해당하는 단계입니다.  
`JavaScript`코드를 `parser`를 통해 분석하여 토큰 단위로 쪼갠 후(lexical analysis), 만들어진 토큰을 기반으로 추상 구문 트리(AST)를 만듭니다.

### 👨‍💻 AST → Interpreter
