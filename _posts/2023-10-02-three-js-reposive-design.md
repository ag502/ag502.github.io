---
title: three.js 반응형 디자인
date: 2023-10-02
categories: [three.js, WebGL]
tags: [three.js]
image:
  path: /assets/img/three-js-main.png
  alt: three-js-logo
---

크기를 지정해주지 않은 `canvas` 는 `300 X 150` 의 크기를 기본값으로 갖습니다. 뷰포트를 채우게끔 `canvas` 크기를 조정하는 두가지 방법을 살펴보고, 각 방법들에서 반응형으로 동작할 수 있게 구현하는 방법을 살펴보겠습니다.

## 💻 뷰포트(viewport) 채우기

### 👨‍💻 CSS 만 활용하기

```html
<canvas class="canvas"></canvas>
```

```css
html,
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

.canvas {
  width: 100%;
  height: 100%;
  display: block;
}
```

위 예시는 `CSS` 만을 활용하여 `canvas` 의 크기를 뷰포트와 일치하게 만드는 코드입니다.  
`html`, `body` 태그에 `overflow: hidden` 규칙을 추가한 이유는 트랙패드와 같은 장비로 인한 스크롤을 방지하기 위해서 입니다.

### 👨‍💻 window.innerWidth, window.innerHeight 활용하기

```css
html,
body {
  margin: 0;
  overflow: hidden;
}

.canvas {
  display: block;
}
```

```javascript
// ...생략...
const canvasSizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvasSizes.width, canvasSizes.height);
// ...생략...
```

## 💻 resize 이벤트 처리하기

### 👨‍💻 CSS 만 활용하기

`CSS` 만 이용하여 크기를 늘인 경우는, 창 크기가 변함에 따라 `mesh` 도 찌그러지거나 늘어나게 됩니다.  
이를 해결하기 위해서는 `camera` 의 `aspect` 값을 `canvas` 비율에 맞게 변형시켜 주어야 합니다.

```javascript
// ...생략...
function animate() {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  requestAnimationFrame(animate);
}

requestAnimateFrame(animate);

// ...생략...
```

위 코드에서 프레임마다 `camera` 의 비율을 `canvas` 의 비율과 일치하게끔 변경하고 있음을 볼 수 있습니다.  
추가로, `aspect` 를 변경시킨 후 `updateProjectionMatrix` 를 호출하고 있는것을 알 수 있는데, 이 함수는 `camera` 의 projection matrix(투영 행렬)을 업데이트 시켜주는 역할을 합니다.
즉 `camera` 의 속성들(`fov`, `aspect`, `far`, `near`, `left`, `right`, `top`, `bottom`...)이 수정될때마다 해당 함수를 실행시켜야 반영이 됩니다.

### 👨‍💻 window.innerWidth, window.innerHeight 활용하기

해당 방법으로 크기를 늘인 경우 문제점은, 창크기가 변함에 따라 `canvas` 크기가 변하지 않는다는 것입니다. 초기에 설정한 넓이(`window.innerWidth`)와 높이(`window.innerHeight`)가 변경되지 않기 때문입니다.  
`resize` 이벤트를 통해 해당 문제를 해결할 수 있습니다.

```javascript
// ...생략...
window.addEventListener("resize", () => {
  canvasSizes.width = window.innerWidth;
  canvasSizes.height = window.innerHeight;

  renderer.setSize(canvasSizes.width, canvasSizes.height);
});

// ...생략...
```

창 크기가 변경됨에 따라, 변경된 창크기를 실시간으로 반영해주는것을 알 수 있습니다.

위 코드를 적용하면, `canvas` 크기가 변경되지 않는다는 문제는 해결되었지만 `mesh` 의 비율이 맞지 않는 문제가 추가로 발생해 `camera` 의 `aspect` 를 변경시켜 주어야 합니다.

```javascript
// ...생략...
window.addEventListener("resize", () => {
  canvasSizes.width = window.innerWidth;
  canvasSizes.height = window.innerHeight;

  camera.aspect = canvasSizes.width / canvasSizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(canvasSizes.width, canvasSizes.height);
});

// ...생략...
```

❗️`resize` 이벤트의 콜백함수 부분은 `animate` 함수로 옮겨도 동일한 결과가 나옵니다. 하지만 `setSize` 를 매 프레임마다 실행하는것은 성능에 영향을 줄 수 있습니다.

## 💻 Anti-Aliasing

### 👨‍💻 CSS 만 활용하기

`CSS` 를 활용해 `canvas` 의 크기를 늘인 경우 아래와 같이 화면이 흐려지고, 픽셀이 깨지는 문제가 발생합니다.

![anti-aliasing-1](/assets/img/three-js-responsive-design/anti-aliasing-1.gif)

`128 X 64` 크기인 이미지를 `400 X 200` 크기로 늘였을 때와 같은 현상입니다. 즉 `300 X 150` 크기의 `canvas` 를 창크기로 늘여 발생한 문제입니다.  
`canvas` 의 원본크기를 드로잉 버퍼라 하는데, 드로잉 버퍼를 창크기로 같이 늘여주어야 해당 문제를 해결할 수 있습니다.

```javascript
// ...생략...
function resizeRendererToDisplaySize(renderer) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const needResize = canvas.width !== width || canvas.height !== height;

  if (needResize) {
    renderer.setSize(width, height, false);
  }

  return needResize;
}

// ...생략...
```

위 코드는 `canvas` 의 드로잉 버퍼와 실제 크기가 일치하는지를 판단해, 일치하지 않을경우 `setSize` 를 통해 드로잉 버퍼를 조절하는 코드입니다.  
`setSize` 의 마지막 인자를 `false` 로 두었는데 이를 통해 `CSS` 속성을 업데이트하는것을 막습니다.

이제 위 코드를 `requestAnimationFrame` 콜백함수에 적용시켜보겠습니다.

```javascript
// ...생략...
function animate() {
  if (resizeRendererToDisplaySize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}

requestAnimationFrame(animate);
// ...생략...
```

위 코드를 적용한 결과는 아래와 같습니다.

![anti-aliasing-2](/assets/img/three-js-responsive-design/anti-aliasing-2.gif)

## 💻 HD-DPI 디스플레이

고해상도(HD-DPI) 디스플레이의 경우, 높은 선명도를 위해 하나의 픽셀이 작은 픽셀들로 이루어져 있습니다.  
하나의 픽셀안에 들어있는 픽셀의 갯수는 `DPR(Device Pixel Ratio)` 로 표현할 수 있습니다. 만약 `DPR` 이 2 라면, 한 픽셀안에 4개의 픽셀이 들어있음을 의미하며,
3 이라면 9개의 픽셀이 들어있음을 의미합니다. 디스플레이별 `DPR` 에 맞춰 화면을 렌더링하는 방법을 알아보겠습니다.

### 👨‍💻 setPixelRatio

```javascript
// ...생략...
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// ...생략...
```

위 예시는 `window.devicePixelRatio` 를 이용하여 현재 기기의 `DPR` 을 구한 후, `setPixelRatio` 에 넘겨주는 코드입니다.  
`Math.min` 을 사용하여 `2` 보다 큰 값으로 지정되지 못하게 제한을 두었는데, 이는 GPU의 계산량 때문입니다. `DPR` 이 3일 경우 GPU는 하나의 픽셀을 그리기 위해서 아홉번의 계산을 해야합니다.
`DPR` 의 값이 커짐에 따라 연산량이 증가함으로 제한을 둘 필요가 있습니다.

### 👨‍💻 직접 계산

`DPR` 에 따라 렌더링하는 또하나의 방법은 직접 계산하는 방법입니다. 공식문서에서는 `setPixelRatio` 를 사용하는 방식보다 해당 방식을 권장하고 있습니다.

```javascript
// ...생략...
function resizeRendererToDisplaySize(renderer) {
  const pixelRatio = Math.min(window.devicePixelRatio, 2);

  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;

  const needResize = canvas.width !== width || canvas.height !== height;

  if (needResize) {
    renderer.setSize(width, height, false);
  }

  return needResize;
}
// ...생략...
```

픽셀(`CSS` 픽셀)에 `DPR` 값을 곱해줌으로써 전체 픽셀의 갯수를 구한것을 알 수 있습니다.

#### 📔 참고자료

[Responsive Design](https://threejs.org/manual/#en/responsive)
