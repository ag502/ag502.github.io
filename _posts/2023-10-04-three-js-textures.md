---
title: three.js texture 살펴보기
date: 2023-10-04
categories: [three.js, WebGL]
tags: [three.js]
image:
  path: /assets/img/three-js-main.png
  alt: three-js-logo
---

## 💻 texture 란?

`texture` 는 보통 `geometry` 의 표면을 감쌀 수 있는 이미지를 의미하며, 보통 포토샵과 같은 프로그램으로 만듭니다.  
여러 종류가 존재하며, 각 `texture` 마다 `geometry` 에 적용되는 효과가 다릅니다.

## 💻 texture 종류

### 👨‍💻 Albedo (Diffuse / Color)

`Albedo` 는 가장 흔한 `texture` 로, 색상과 패턴을 이용하여 물체의 질감이나 색을 표현합니다.

### 👨‍💻 Opacity (Transparency)

`Opacity` 는 특정 부분을 투명하게 만들 수 있는 `texture` 입니다.  
회색조(gray scale)를 띄며, 흰색부분은 보이는 부분을, 검은색 부분은 보이지 않는 부분을 의미합니다.
회색을 띄는 부분은 흰색과 검은색 사이의 다양한 값의 투명도를 나타냅니다.

### 👨‍💻 Height (Displacement)

`Height` 는 높낮이(굴곡)를 표현하기 위하는 `texture` 입니다.  
회색조(gray scale)을 띄며, 해당 `texture` 가 적용되는 `geometry` 의 면들을 잘게나누어 해당 정점들을 변경하는 특성이 있습니다.
`texture` 의 검은색 부분은 정점을 아래로 이동시키며, 흰색 부분은 위로 이동시킵니다. 회색을 띄는 부분은 두색 사이의 지점을 의미합니다.  
`Height` 의 장점은 세부적인 표현이 가능한 것이지만, 성능상의 문제가 발생할 수 있습니다.

### 👨‍💻 Normal

`Normal` 은 `Height` 와 마찬가지로 높낮이를 표현하기 위해 사용한다는 점이 비슷하지만 방식이 다릅니다.  
`Normal` 은 `geometry` 의 정점들을 변경하지 않고, 빛이 표면과 상호작용하는 방식을 가짜로 만들어 높낮이를 표현합니다. 또한 연한 보라색을 띄고 있으며, `rgb` 값들은 높낮이나, 틈을 나타냅니다.

### 👨‍💻 Ambient Occlusion

`geometry` 가 빛에 얼마나 노출되는지를 표현하기 위해 사용되는 `texture` 입니다.  
회색조를 띄며, 밝은 부분은 빛을 흡수하는 부분이고 어두운 부분은 빛에 덜 반응하는 부분을 나타냅니다.

### 👨‍💻 Metalness

금속성과, 금속의 반사를 표현하기 위해 사용되는 `texture` 입니다.  
회색조의 이미지이며, 흰색 부분은 금속성을 띄는 부분을, 검은색 부분은 금속성을 띄지 않는 부분을 의미합니다.

### 👨‍💻 Roughness

거칠기를 나타내기 위해 사용되는 `texture` 입니다.  
회색조이며, 흰색은 최대 거칠기를, 검은색은 최소 거칠기를 의미합니다.

## 💻 texture 불러오기

`texture` 를 `geometry` 에 적용시키기 위해서는 `texture` 를 불러와야 합니다. `texture` 를 불러오는 방법은 다양하지만 대표적인 방법 두가지를 살펴보겠습니다.

### 👨‍💻 image.onload

```javascript
// ...생략...
THREE.ColorManagement.enabled = false;

const image = new Image();

const texture = new THREE.Texture(image);
image.src("image-path");

image.onload = () => {
  texture.needsUpdate = true;
};

// ...생략...

const mesh = new THREE.Mesh(
  geometry,
  new THREE.BasicMeshMaterial({ map: texture })
);

// ...생략...
```

위 예시는 `Image` 객체를 사용하여 `texture` 를 불러오는 코드입니다.  
`onload` 는 `Image` 객체에 이미지 로딩이 완료되면 실행되는 함수로, 함수 내부에 `texture.needsUpdated = true` 가 선언된 것을 볼 수 있습니다. 이는 이미지 로딩이 완료되었어도 `texture` 는 완료여부를 알지못하기 때문에 `needsUpdate` 를 `true` 로 설정해 `texture` 를 업데이트 해주기 위함입니다.

### 👨‍💻 TextureLoader

```javascript
// ...생략...
THREE.ColorManagement.enabled = false;

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("image-path");

// ...생략...
const mesh = new THREE.Mesh(
  geometry,
  new THREE.BasicMeshMaterial({ map: texture })
);

// ...생략...
```

위 예시와 같이 `TextureLoader` 를 사용해서 `texture` 를 불러올 수 있으며, `onload` 방식으로 불러왔을때과 동일한 결과를 반환합니다.

#### 🖊 TextureLoader의 콜백함수

`TextureLoader` 의 `load` 함수는 이미지 `url` 외에도 `onLoad`, `onError`, `onProgress` 와 같은 콜백함수를 인자로 받습니다.

- `onLoad`  
  로딩이 완료되었을 때 호출되는 함수로, 로딩된 `texture` 를 인자로 갖습니다.

- `onError`  
  로딩 중 오류가 발생했을 경우 실행됩니다.

- `onProgress`  
  로딩이 진행 중일 경우 실행되는 콜백입니다. [현재는 지원되지 않습니다.](https://threejs.org/docs/index.html?q=Texture#api/en/loaders/TextureLoader.load)

## 💻 LoadingManager

`texture` 들의 로딩 상태를 추적하고, 상태에 따른 인터렉션을 주기위해 `LoadingManager` 를 사용할 수 있습니다.

```javascript
// ...생략...
const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);

const materials = [
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("image-path-1"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("image-path-2"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("image-path-3"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("image-path-4"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("image-path-5"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("image-path-6"),
  }),
];
// ...생략...
```

위 예시는 6개의 이미지를 `texture` 로 사용하기 위해 불러온 후, `BoxGeometry` 의 한 면씩 적용되도록 만드는 코드의 일부입니다.
`LoadingManager` 를 사용하기 위해, `TextureLoader` 생성자 인자에 전달한 것을 볼 수 있습니다.

이제 `LoadingManager` 가 속성으로 갖는 함수들을 이용해 자연스러운 UX 를 가질 수 있도록 코드를 추가해 보겠습니다.

### 👨‍💻 onLoad

`texture` 들이 모두 로딩 되었을 때, 실행되는 함수입니다.

```javascript
// ...생략...
loadingManager.onLoad = () => {
  const mesh = new THREE.Mesh(geometry, materials);
  scene.add(mesh);
};
// ...생략...
```

위 코드는 모든 `texture` 들의 로딩이 완료 되었을 때, `mesh` 를 생성하는 코드로 이미지간 로딩 속도가 균일하지 않은 상황에서 유용하게 사용할 수 있습니다.

### 👨‍💻 onProgress

여러개의 자료들중, 한개가 완료될 때마다 실행되는 함수로 `url`, `itemsLoaded`, `itemsTotal` 세개의 인자를 받습니다.  
`url` 은 현재 로딩중인 자료의 `url` 을, `itemsLoaded` 는 현재까지 로딩완료된 자료의 갯수, `itemsTotal` 은 로딩해야 할 전체 자료의 갯수를 의미합니다.

```javascript
// ...생략...
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(
    `current url is ${url}, and this item is ${itemsLoaded}/${itemsTotal}`
  );
};
```

`onProgress` 함수를 이용해 프로그래스 바를 만들 수도 있습니다.

아래 이미지는 위 코드를 실행시킨 결과입니다.

![loadingManager-onProgress-1](/assets/img/three-js-texture/loadingManager-onProgress-1.png)

### 👨‍💻 onStart

여러개의 자료들중, 한개가 로딩을 시작할 때 실행되는 함수로 `onProgress` 와 같은 인자를 받습니다.

### 👨‍💻 onError

로딩 과정중에 오류가 발생하면 실행되는 함수 입니다.  
`url` 을 인자로 받으며, 오류가 발생한 자료의 `url` 을 의미합니다.

위 코드들을 추가한 후 실해시키면 아래와 같은 `mesh` 가 나옵니다,

![loadingManager-1](/assets/img/three-js-texture/loadingManager-1.png)

#### 📔 참고자료

[How to make photorealistic 3D graphics with different texture maps?](https://www.webdew.com/blog/how-to-make-photorealistic-3d-graphics)  
[A Brief Introduction to Texture mapping for 3D Artists](https://professional3dservices.com/blog/texture-mapping-guide.html)  
[Texture Maps: The Ultimate Guide For 3D Artists](https://conceptartempire.com/texture-maps/)
