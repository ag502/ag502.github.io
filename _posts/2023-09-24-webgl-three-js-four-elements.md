---
title: WebGL과 three.js의 기본요소
date: 2023-09-23
categories: [three.js, WebGL]
tags: [three.js]
image:
  path: /assets/img/three-js-main.png
  alt: three-js-logo
---

## 💻 WebGL 이란?

`WebGL` (Web Graphics Library)은 `OpenGL` 에 기반한 웹 표준 API로, 해당 API를 사용하여 `canvas` 에 2D 나 3D 그래픽을 렌더링할 수 있습니다.  
`WebGL` 을 사용한 코드는 GPU 상에서 병렬적으로 처리되어 성능면에서 뛰어나다는 장점이 있습니다.

## 💻 Render Pipeline

![geeks-for-geeks](/assets/img/webgl-three-js-four-elements/render-pipeline.png)

`WebGL` 이 그래픽을 렌더링할 때는 위의 단계를 거칩니다.

1. Vertex Shader  
   GPU가 점(`vertex`)들의 위치를 병렬적으로 계산해 올바른 곳에 위치시킵니다

2. Primitives Generation(Primitive Assembly)  
   `Vertex` 들을 연결해 삼각형들의 집합으로 만듭니다.

3. Rasterization  
   만들어진 삼각형 집합을 픽셀로 변형시킵니다.

4. Fragment Shader  
   픽셀을 지정한 색과 질감등으로 채웁니다.

`Vertex` 들을 위치 시키고, 픽셀에 색을 채우는 것과 같은 작업은 `shader` (`vertex shader`, `fragment shader`) 단계에서 일어나는데, 이 단계는 코드로 제어할 수 있습니다.

`Primitives Generation` 단계에 알 수 있듯이, `WebGL` 을 이용하여 렌더링하는 물체들은 모두 삼각형들로 구성 되어있습니다. 삼각형을 렌더링에 사용하는 이유는 기하학적인 단순성및 계산의 효율성등의 이유가 있습니다.

## 💻 three.js 의 네가지 기본요소

`three.js` 로 무언가를 만들기 위해서는 `scene`, `mesh(object)`, `camera`, `renderer` 라는 네가지 요소가 필요합니다.  
빨간색 정육면체를 만들어보면서, 네가지 요소를 살펴보겠습니다.

### 👨‍💻 Scene

물체, 빛 등 렌더링되는 모든 물체들을 포함하는 컨테이너와 같은 개념입니다.

```javascript
import * as THREE from "three.js";

const scene = new THREE.Scene();
```

위와 같이 `scene` 을 생성할 수 있으며, 아래에서 살펴볼 `renderer` 가 `scene` 을 렌더링하게 됩니다.

### 👨‍💻 Mesh

렌더링 될 물체를 의미합니다. 기본적인 입체도형(primitive geometry) 이거나 임포트한 모델, 빛 등이 될 수 있습니다.  
`Mesh` 는 모양을 결정하는 `Geometry` 와 색과 같은 표면의 특성을 결정하는 `Material` 의 조합으로 나타낼 수 있습니다.

> `Mesh` = `Geometry` + `Material`

```javascript
// ...생략...

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const redMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000" });
const redCube = new THREE.Mesh(cubeGeometry, redMaterial);

scene.add(redCube);
```

`redCube` (`mesh`) 는 `cubeGeometry` 와 `redMaterial` 의 조합으로 생성됐음을 알 수 있습니다.
또한 `scene` 에 `mesh` 를 추가한것도 볼 수 있습니다.

### 👨‍💻 Camera

`Camera` 는 보이지 않는 물체로, 렌더링이 될 때 지정한 `camera` 의 시점에 따라 장면이 보입니다.  
`three.js` 에서 제공하는 `camera` 의 종류는 여러가지 이며, 한번에 여러개를 지정해 교체할 수도 있습니다.

```javascript
// ...생략...

const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
scene.add(camera);
```

위 코드에서 `PerspectiveCamera` 를 생성할 때, 두 개의 필수 인자를 전달했음을 볼 수 있습니다.

1. `fov` (Field of View)  
   시야각을 의미하며, 통상적으로 수직 시야각을 의미합니다.  
   `fov` 값이 크면 한번에 보이는 장면이 많아지지만, 끝에서 왜곡이 발생하게 됩니다. 반면에 값이 작아지면, 물체를 확대한 것과 같은 효과가 나타납니다.
2. `aspect ratio`  
   보통 `canvas` 의 너비를 높이로 나눈 값으로 지정해줍니다.

### 👨‍💻 Renderer

`Renderer` 는 `camera` 의 시점으로 `scene` 을 렌더링하는 역할을 합니다. 렌더링한 결과는 `canvas` 에 나타납니다.

```html
<canvas id="canvas"></canvas>
```

```javascript
// ...생략...

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
```

위 코드는 `WebGLRender` 를 사용하여 화면을 렌더링하는 코드 입니다.  
`renderer` 에 `canvas` 를 넘겨주지 않으면, `canvas` `DOM` 을 반환하는데, 이 경우 `canvas` 을 `body` 태그에 추가해야(append)합니다.

위 코드를 최종적으로 실행해보면 아무것도 나타나지 않습니다.  
그 이유는 `camera` 와 `mesh` 가 모두 기본 위치(원점)에 존재하고 있으며, `camera` 가 `mesh` 안에 있기 때문입니다.
`Camera` 는 `mesh` 의 바깥면, 안쪽면 중 한쪽만 볼 수 있습니다.

현재의 상태를 그림으로 표현하면 아래와 같습니다.

![red-cube-coordinate](/assets/img/webgl-three-js-four-elements/red-cube-coordinate.png)

`Camera` 는 `-z` 축을 바라보고 있으며, 원점에 존재하는 빨간색 정육면체 내부에 위치하고 있습니다. 따라서 물체를 보이게 하기위해서는 물체를 `-z` 축으로 옮기거나, `camera` 를 `+z` 축으로 이동시켜야 합니다.

```javascript
// ...생략...
camera.position.z = 3;
// ...생략...
```

위 코드는 `camera` 의 위치를 `z` 축으로 3만큼 이동시킴으로서 물체를 보이게 했습니다.

#### 📔 참고자료

[장면 만들기(Creating a scene)](https://threejs.org/docs/index.html#manual/ko/introduction/Creating-a-scene)  
[WebGL Introduction](https://www.geeksforgeeks.org/webgl-introduction/)  
[Rendering Pipeline Overview](https://www.khronos.org/opengl/wiki/Rendering_Pipeline_Overview)
