---
title: three.js Camera 살펴보기
date: 2023-09-30
categories: [three.js, WebGL]
tags: [three.js]
image:
  path: /assets/img/three-js-main.png
  alt: three-js-logo
---

`three.js` 에는 여러가지 종류의 `Camera` 가 있습니다.  
대부분의 `Camera` 는 `Object3D` 를 상속받으며, `Camera` 클래스는 추상 클래스(abstract class) 입니다.

## 💻 PerspectiveCamera

`PerspectiveCamera` 는 원근투영(perspective projection)을 사용하는 `camera` 입니다.  
사람이 물체를 보는 방식과 유사한 방식으로 가장 많이 사용하는 `camera` 입니다.

> <span style="color:cyan;">PerspectiveCamera(fov: Number, aspect: Number, near: Number, far: Number)</span>

```javascript
// ...생략...
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
scene.add(camera);
// ...생략...
```

위는, `PerspectiveCamera` 의 생성자와, 이를 활용하여 `camera` 를 생성하는 코드입니다. `PerspectiveCamera` 생성자에 전달하는 인자들의 의미를 살펴보겠습니다.

### 👨‍💻 Fov(Field of View), Aspect, Near, Far

`PerspectiveCamera` 의 네가지 인자들은 frustum(절두체)을 만듭니다.

![three-js-frustum](/assets/img/three-js-camera/frustum.png)

- `fov`(Field of View)  
  `fov` 는 시야각을 의미합니다. `three.js` 에서는 위 그림과 같이 수직 시야각을 의미하며, 단위는 라디안이 아닌 도(degree) 입니다.  
  `fov` 가 커질수록, 시야각이 넓어져 화면에 많이 요소가 렌더링되지만 물체가 축소되며, 가장자리가 왜곡됩니다. 반대의 경우, 물체가 확대되어 렌더링됩니다.

  ![fov](/assets/img/three-js-camera/fov.png)

  가장 많이 사용되는 `fov` 는 45도에서 75도 사이의 값입니다.

- `aspect`  
  `width` 값을 `height` 로 나눈 값입니다. 일반적으로 `canvas` 의 `width` 를 `height` 나눈 값을 사용합니다.

- `near` / `far`  
  `near`, `far` 는 각각 절두체의 시작과 끝을 의미하며, `camera` 앞에 물체가 렌더링될 공간의 범위를 지정하는 역할을 합니다.  
  물체는 `near` 와 `far` 사이의 공간에 위치해야 렌더링 됩니다. 즉, `near` 보다 가깝게 위치하거나 `far` 보다 멀리 위치하게 되면 렌더링되지 않습니다.

  ```javascript
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    2.4,
    1000
  );
  ```

  물체는 `(0, 0, 0)` 에 위치하고, 카메라는 `(0, 0, 3)` 에 존재하는 상황에서 `near` 를 2.4로 설정한 코드입니다.  
  현재 `camera` 위치에서 2.4 만큼 떨어진 곳에 `near` 평면이 위치하게 됨으로 물체가 부분적으로 렌더링 됩니다.

  ![near](/assets/img/three-js-camera/near.gif)

  ❗️ `fov` 는 `near/far` 평면의 높이와 너비에 영향을 줍니다. `fov` 가 증가하게되면, 평면 높이도 커지게되고 설정해준 `aspect` 를 맞추기위해 너비도 비율에 따라 증가하게 됩니다.  
  반면에 `aspect` 는 평면의 너비에만 영향을 줍니다.

## 💻 OrthographicCamera

`OrthographicCamera` 는 정사영(orthographic projection)을 사용하는 `camera` 입니다. 따라서 렌더링되는 물체는 거리와 상관없이 항상 동일한 크기를 갖습니다.  
`OrthographicCamera` 는 2D 화면이나 UI 요소를 렌더링하는데 사용되기 적합합니다.

> <span style="color:cyan;">OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )</span>

```javascript
// ...생략...
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
```

### 👨‍💻 Left/Right/Top/Bottom

![orthographic-frustum](/assets/img/three-js-camera/orthographic-frustum.png)

`OrthographicCamera` 생성자의 6개 인자는 위의 절두체를 만듭니다.  
`left`, `right`, `top`, `bottom` 는 각각 절두체의 왼쪽, 오른쪽, 위, 아래의 평면의 위치를 결정합니다. 각각의 값을 벗어나는 물체는 렌더링되지 않습니다.

```javascript
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
```

![orthographic-camera-1](/assets/img/three-js-camera/orthographic-camera-1.gif)

위 예시는 넓이와 높이가 같은 절두체를 가진 `OrthographicCamera` 를 이용해 정육면체를 렌더링한 결과입니다.  
렌더링된 물체가 정육면체가 아닌 직육면체임을 볼 수 있습니다. 이런 결과가 나온 이유는 절두체의 크기와 렌더링될 캔버스의 크기의 비율이 맞지 않기 때문입니다.
다시말해 절두체가 캔버스 크기에 맞추기위해 늘어났기 때문에 위와 같은 결과가 나온것입니다.

따라서 캔버스 크기 비율에 맞추기 위해서 아래와 같이 `left`, `right` 값을 수정하면 정상적인 정육면체가 렌더링됩니다.

```javascript
const aspectRatio = canvas.width / canvas.height;
const camera = new THREE.OrthographicCamera(
  -1 * aspectRatio,
  1 * aspectRatio,
  1,
  -1,
  0.1,
  100
);
```

![orthographic-camera-2](/assets/img/three-js-camera/orthographic-camera-2.gif)

## 💻 ArrayCamera

`ArrayCamera` 는 여러 종류의 `camera` 들을 배열로 묶은 것으로, 장면 전환과 같은 목적으로 사용합니다.

```javascript
const cameras = [
  new THREE.PerspectiveCamera(fov, aspect, near, far),
  new THREE.PerspectiveCamera(fov, aspect, near, far),
];

const camera = new THREE.ArrayCamera(cameras);
```

`ArrayCamera` 의 원소로 사용되는 `camera` 들은 반드시 `viewport` 를 지정해 주어야 합니다.

## 💻 CubeCamera

`CubeCamera` 는 [WebGLCubeRenderTarget](https://threejs.org/docs/?q=cubecamera#api/en/renderers/WebGLCubeRenderTarget) 에 렌더링 되는 6개의 `camera` 를 생성합니다.
`CubeCamera` 는 6개의 방향(위, 아래, 전, 후, 좌, 우)을 향하고 있는 `camera` 를 이용하여 주변 환경을 캡처하고 `cube map`(큐브 맵) 형태로 저장합니다.
해당 큐브 맵은 특정 물체의 `material` 로 사용되어 물체의 표변에 반사와 같은 효과를 줄 수 있습니다.

## 💻 마우스로 Camera 움직이기

마우스의 움직임에 따라 카메라가 움직이는 효과를 구현해보겠습니다.

1. `canvas` 에 `mousemove` 이벤트를 등록한 후 `offsetX`, `offsetY` 속성을 이용합니다.

   ```javascript
   // ...생략...
   canvas.addEventListener("mousemove", (e) => {
     const { offsetX, offsetY } = e;

     console.log(`x: ${offsetX}, y:${offsetY}`);
   });
   // ...생략...
   ```

   위 예시는 `canvas` 내에서 마우스 포인터가 움직이게 되면, `canvas` 왼쪽 위 모서리(`(0, 0)`)를 기준으로 `x`, `y` 좌표가 출력되는 코드입니다.

2. `canvas` 좌표값 보정하기  
    `canvas` 의 좌표는 창크기, 설정한 `canvas` 의 크기에 따라 달라질 가능성이 있습니다. 따라서 보정을 해줄 필요가 있습니다.

   ```javascript
   // ...생략...
   const curCursor = {
     x: 0,
     y: 0,
   };

   canvas.addEventListener("mousemove", (e) => {
     const { offsetX, offsetY } = e;

     const adjustedX = offsetX / canvas.width;
     const adjustedY = offsetY / canvas.height;

     curCursor.x = adjustedX;
     curCursor.y = adjustedY;

     console.log(`x: ${adjustedX}, y:${adjustedY}`);
   });
   // ...생략...
   ```

   원래의 좌표에서 넓이와, 높이를 나눠주게 되면 모든 좌표값이 0과 1사이의 값으로 정규화 됩니다.

   ![0-1-normalized-canvas](/assets/img/three-js-camera/0-1-normalized-canvas.png)

   `three.js` 의 좌표계에는 음수도 존재해야함으로 이 부분을 추가로 보정해 주어야 합니다.

   ```javascript
   // ...생략...
   const curCursor = {
     x: 0,
     y: 0,
   };

   canvas.addEventListener("mousemove", (e) => {
     const { offsetX, offsetY } = e;

     const adjustedX = offsetX / canvas.width - 0.5;
     const adjustedY = offsetY / canvas.height - 0.5;

     curCursor.x = adjustedX;
     curCursor.y = adjustedY;

     console.log(`x: ${adjustedX}, y:${adjustedY}`);
   });
   // ...생략...
   ```

   ![0.5-normalized-canvas](/assets/img/three-js-camera/0.5-normalized-canvas.png)

3. `Camera` `position` 속성, 마우스 좌표와 동기화 시키기  
   마우스 커서의 좌표에 따라 `camera` 객체가 움직이게끔 설정해보겠습니다.

   ```javascript
   // ...생략...

   function animate() {
     camera.position.set(curCursor.x, curCursor.y);

     requestAnimationFrame(animate);
   }

   requestAnimationFrame(animate);

   // ...생략...
   ```

   ![cursor-move-1](/assets/img/three-js-camera/cursor-move-1.gif)

4. 상하이동 움직임 수정하기  
   위 결과에서 좌우로 움직일 경우, `camera` 와 커서의 이동이 일치하지만, 상하로 움직이는 경우는 반전이 됩니다.  
   그 이유는 `canvas` 의 `y` 축 방향과 `three.js` 좌표계에서 `y` 축 방향이 반대이기 때문입니다. 즉 `canvas` 의 `y` 축은 아래쪽이 양의 방향이지만, `three.js` 의 경우 위쪽이 양의 방향 이기 때문에 움직임이 반전되어 나타납니다.

   ```javascript
   // ...생략...

   canvas.addEventListener("mousemove", (e) => {
     const { offsetX, offsetY } = e;

     const adjustedX = offsetX / canvas.width - 0.5;
     const adjustedY = -(offsetY / canvas.height - 0.5);

     curCursor.x = adjustedX;
     curCursor.y = adjustedY;

     console.log(`x: ${adjustedX}, y:${adjustedY}`);
   });

   // ...생략...
   ```

   위 코드와 같이 `y` 축에 `-1` 을 곱해주면, 정상적인 결과가 나옵니다.

   ![cursor-move-2](/assets/img/three-js-camera/cursor-move-2.gif)

   5. `Camera` 가 물체 가운데를 보게 만들기

      ```javascript
      // ...생략...

      function animate() {
        camera.position.set(curCursor.x, curCursor.y);
        camera.lookAt(mesh.position);

        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);

      // ...생략...
      ```

## 💻 마우스로 Camera 회전시키기

```javascript
const animate = () => {
  camera.position.x = Math.sin(curCursor.x * Math.PI * 2) * 3;
  camera.position.z = Math.cos(curCursor.x * Math.PI * 2) * 3;
  camera.position.y = curCursor.y * 3;

  camera.lookAt(mesh.position);

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
};

animate();
```

위 코드는 좌우로 마우스를 움직임에 따라 카메라가 수평으로 회전하게끔하는 코드입니다.

#### 📔 참고 자료

[Exploring Cameras in Three.js](https://medium.com/@gopisaikrishna.vuta/exploring-cameras-in-three-js-32e268a6bebd)  
[Camera](https://threejs.org/docs/?q=camera#api/en/cameras/Camera)  
[Fundamentals](https://threejs.org/manual/#en/fundamentals)  
[Perspective Projections](http://learnwebgl.brown37.net/08_projections/projections_perspective.html)  
[ArrayCamera](https://threejs.org/docs/?q=arrayCa#api/en/cameras/ArrayCamera)  
[Dynamic reflections in Three.js](https://medium.com/@pierfrancesco-soffritti/dynamic-reflections-in-three-js-2d46f3378fc4)  
[Cube mapping](https://en.wikipedia.org/wiki/Cube_mapping)
