---
title: requestAnimationFrame으로 애니메이션 만들기
date: 2023-09-29
categories: [JavaScript]
tags: [JavaScript]
image:
  path: /assets/img/js-main.png
  alt: javascript logo
---

## 💻 애니메이션의 원리

사람이 움직이는 물체를 볼때, 초당 평균 150장의 스냅샷(snapshot) 을 찍은 후 해당 사진들을 연결시켜 움직인다고 인식하게 됩니다. 애니메이션에서는 이 스냅샷들은 프레임(frame)이라고 정의합니다.

왼쪽에서 오른쪽으로 위치를 이동하는 물체가 있다고 가정해 보겠습니다.  
앞에서 언급했듯이, 물체를 이동시키기 위해서는 매 프레임별로 조금씩 위치를 움직여 주어야 합니다.
대부분의 디스플레이는 초당 60개의 프레임(60fps)을 보여주며, 한 프레임을 보여주는데 걸리는 시간은 대락 16.6ms(1s/60fps) 정도가 됩니다.  
따라서, 60fps 디스플레이에서는 16.6ms 간격으로 물체를 움직여 주어여 한다는 결론이 나옵니다.

```javascript
setInterval(() => {
  move();
}, 16.6);
```

위 코드는, `setInterval` 을 이용하여, 16.6ms 주기로 `move` 함수를 실행하는 코드입니다.  
해당 코드의 문제점은 자원을 많이 차지하는 작업을 수행할 때, 설정한 시간이 보장되지 않는다는 점입니다. `requestAnimationFrame` 을 사용하면 해당 문제를 해결할 수 있습니다.

## 💻 requestAnimationFrame

`requestAnimationFrame` 함수는 다음 리페인트 직전에 넘겨 받은 콜백함수를 실행시켜주는 함수입니다. 따라서 연속적으로 실행을 시키기 위해서는 재귀호출을 해야합니다.

```javascript
const circle = document.querySelector("#circle");

const left = 0;

function move() {
  left += 0.5;

  circle.style.transform = `translateX(${left}px)`;

  if (left !== 300) {
    requestAnimationFrame(move);
  }
}

move();
```

위 예시는, 왼쪽에서 오른쪽으로 동그라미를 프레임별 0.5px 씩 300px 만큼 움직이게 하는 코드입니다. `move` 함수 내부에서 `requestAnimationFrame` 을 호출하고 있음을 알 수 있습니다.

![request-animation-frame-1](/assets/img/requsetAnimatinFrame/request-animation-frame-1.gif)

## 💻 requestAnimationFrame의 문제점

`requestAnimationFrame` 의 문제점은 같은 애니메이션이라도 프레임률이 다른 디스플레이에서 다르게 보일 수 있다는 것입니다.  
60fps의 프레임률을 가지는 디스플레이의 경우 `requestAnimationFrame` 이 16.6ms 주기로 실행되지만, 120fps 디스플레이의 경우 대략 8.3ms 만큼의 주기로 실행됩니다.

![request-animation-frame-1](/assets/img/requsetAnimatinFrame/request-animation-frame-1.gif)
![request-animation-frame-2](/assets/img/requsetAnimatinFrame/request-animation-frame-2.gif)

위 자료는 같은 애니메이션을 각각 120fps, 30fps 디스플레이에서 실행시킨 결과입니다. 120fps 디스플레이의 경우 30fps 디스플레이보다 실행 주기가 짧아 300px에 더 빨리 도달했음을 알 수 있습니다.

### 👨‍💻 해결책

`requestAnimationFrame` 의 콜백함수는 `TimeStamp` 를 인자로 받습니다. 이 인자는 콜백이 실행되고 경과된 시간을 의미합니다. 이를 활용하면 디스플레이간 차이를 없앨 수 있습니다.

```javascript
let left = 0;
let start = null;

function move(timeStamp) {
  if (!start) {
    // 최초 실행 시점
    start = timeStamp;

    // 최초 실행 시점으로 부터의 경과시간
    const elapsedTime = timeStamp - start;

    // 0.05px/ms 로 움직이도록 위치 지정
    left = Math.min(elapsedTime * 0.05, 300);

    circle.style.transform = `translateX(${left})`;

    if (left < 300) {
      requestAnimationFrame(move);
    }
  }
}

requestAnimationFrame(move);
```

처음으로 실행된 시점으로 부터의 시간을, 1ms당 움직이고자 하는 값에 곱해줌으로써 프레임율과 무관하게 항상 같은 애니메이션을 볼 수 있습니다.

![request-animation-frame-3](/assets/img/requsetAnimatinFrame/request-animation-frame-3.gif)  
![request-animation-frame-3](/assets/img/requsetAnimatinFrame/request-animation-frame-3.gif)

## 💻 원운동하는 애니메이션 만들기

`requestAnimationFrame` 을 이용하여 원운동하는 물체를 만들어보겠습니다.

```javascript
let left = 0;
let above = 0;
let start = null;

function move(timeStamp) {
  if (!start) {
    // 최초 실행 시점
    start = timeStamp;

    // 최초 실행 시점으로 부터의 경과시간
    const elapsedTime = timeStamp - start;

    left = 150 * Math.sin(0.0005 * elapsed) + 150;
    above = 150 * Math.cos(0.0005 * elapsed) + 150;

    circle.style.transform = `translate(${left}px, ${above}px)`;

    requestAnimationFrame(move);
  }
}

requestAnimationFrame(move);
```

원운동을 구현하기 위해서 한축에는 `sin` 함수의 값에 따른 좌표를, 다른 축에는 `cos` 함수의 값에 따른 좌표를 지정해 주어야합니다.

![wikipedia](/assets/img/requsetAnimatinFrame/draw-circle-sin-cos.gif)

이제 삼각함수 부분을 살펴보겠습니다.

> asin(bx + c) + d

위와 같은 삼각함수에서 주기, 최댓값, 최솟값은 각각 다음과 같습니다.

- 주기: 2𝛑 / ❘b❘
- 최댓값: ❘a❘ + d
- 최솟값: -❘a❘ + d

이 정보를 코드의 `150 * Math.sin(0.0005 * elapsed) + 150` 에 대입해보면, 주기 `2𝛑 / 0.0005`, 최댓값 `300`, 최솟값 `0` 이 나옵니다.  
계수 `b` 자리에 `0.0005` 를 설정해 주기를 크게 만든이유는, 진행되는 애니메이션의 속도를 줄이기 위해서입니다. 또한 `a`, `b` 자리에 `150` 을 설정해준 이유는 0px ~ 300px 사이를 움직이는 원을 만들기 위해서 입니다.

![circle](/assets/img/requsetAnimatinFrame/circle.gif)

#### 📔 참고자료

[Understanding animation, duration and easing using requestAnimationFrame](https://medium.com/burst/understanding-animation-with-duration-and-easing-using-requestanimationframe-7e3fd1688d6c)
[circle-cos-sin](https://en.m.wikipedia.org/wiki/File:Circle_cos_sin.gif)
