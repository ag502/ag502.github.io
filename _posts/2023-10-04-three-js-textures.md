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

`Normal` 은 `geometry` 의 정점들을 변경하지 않고, 법선 벡터를 사용하여 빛이 표면과 상호작용하는 방식을 가짜로 만들어 표면의 디테일을 표현합니다. 또한 연한 보라색을 띄고 있으며, `rgb` 값들은 높낮이나, 틈을 나타냅니다.

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

## 💻 UV Mapping

`UV mapping` 은 2D 이미지를 3D 물체의 표면으로 투영하는 과정으로, 평면인 `texture` 를 3D인 `mesh` 에 적용시키기 위해 사용하는 프로세스 입니다.
또한 `UV mapping` 을 진행하기 위해서는 `mesh` 를 전개도와 비슷한 평면으로 변환(`UV Map`)시켜주는 과정이 필요한데 이 과정을 `UV unwrapping` 이라고 합니다.

### 👨‍💻 UV 좌표계

`UV mapping`, `UV unwrapping` 에 언급된 `UV` 는 `mesh` 의 정점들(vertices)에 저장된 2D `texture` 의 좌표를 의미합니다.  
보통 `openGL` 에서는 `U` 는 가로축, `V` 는 세로축을 의미하지만 이는 사용하는 도구에 따라 상이합니다. 또한 각축의 최솟값은 `0`, 최댓값은 `1` 입니다.

![uv-coordinate](/assets/img/three-js-texture/uv-coordinate.png)

위 그림은 `texture` 의 `UV` 좌표계를 나타낸 것이며, 아래는 해당 `texture` 를 `BoxGeometry` 의 한 면에 `UV` 좌표에 따라 적용시킨 예시입니다.

![uv-mapping](/assets/img/three-js-texture/uv-mapping.png)

`BoxGeometry` 의 각 정점들에 할당된 `UV` 좌표에 해당하는 `texture` 가 적용되었습니다. 또한 `UV` 의 좌표의 최댓값보다 큰 좌표가 할당 되었을 경우, 빈공간을 채우기위해 반복되었음을 알 수 있습니다. 하지만 이는 설정에따라 달라집니다.

## 💻 texture 변형하기

### 👨‍💻 repeat

`UV` 좌표계의 축 방향으로 `texture` 를 얼마나 반복시킬 것인지 설정하는 옵션입니다.  
`Vector2` 타입을 가지고 있으며, 1보다 큰 값을 설정하게되면 `wrap` 속성(`wrapS`, `wrapT`) 에 `THREE.RepeatWrapping` 이나 `THREE.MirroredRepeatWrapping` 을 추가로 지정해 주어야 합니다.

```javascript
// ...생략...
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load("image-path");

texture.repeat.x = 3;

// ...생략...
```

아래 이미지는 위 코드를 실행시킨 결과 입니다.

![texture-repeat-1](/assets/img/three-js-texture/texture-repeat-1.png)

`U` (`x`) 축 방향으로 늘어나기만 할 뿐, 반복되지 않았음을 알 수 있습니다. 따라서 `wrapS` 에 `THREE.RepeatWrapping` 속성을 지정해야 합니다.

```javascript
// ...생략...
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load("image-path");

texture.repeat.x = 3;
texture.wrapS = THREE.RepeatWRapping;

// ...생략...
```

![texture-repeat-2](/assets/img/three-js-texture/texture-repeat-2.png)

만약 `wrap` 프로퍼티에 `THREE.MirroredRepeatWrapping` 을 설정해주게 되면, 매 반복시 `texture` 가 반전됩니다.

### 👨‍💻 offset

`UV` 좌표계의 축 방향으로 `mesh` 에 적용될 `texture` 의 `offset` 을 설정해 줍니다.  
`Vector2` 타입을 가집니다.

```javascript
// ...생략...
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load("image-path");

texture.repeat.x = 3;
texture.wrapS = THREE.RepeatWRapping;

texture.offset.x = 0.5;

// ...생략...
```

위 코드는 `x` 축 방향으로 `texture` 를 3번 반복한 후, `offset` 을 0.5로 설정 한 코드 이며 결과는 아래와 같습니다.

![texture-offset-1](/assets/img/three-js-texture/texture-offset-1.png)

### 👨‍💻 rotation

`texture` 가 중점을 중심으로 얼마나 회전할지를 결정하는 속성입니다.  
중점은 `center` 속성을 통해 설정해 줄 수 있으며, 기본값은 `UV` 좌표로 `(0, 0)` 즉 왼쪽 아래가 됩니다.

```javascript
// ...생략...
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load("image-path");

texture.repeat.x = 3;
texture.wrapS = THREE.RepeatWrapping;

texture.rotation = Math.PI * 0.25;
```

위 예시는 `texture` 를 `𝛑/4` 만큼 회전시키는 코드이며, 결과는 아래와 같습니다.

![texture-rotation-1](/assets/img/three-js-texture/texture-rotation-1.png)

`UV` 좌표계에서 `(0, 0)` 즉 왼쪽 아래를 중심으로 회전이 되었고, 그로인해 생긴 빈공간을 채우기위해 `texture` 가 늘어난것을 볼 수 있습니다.

```javascript
// ...생략...
texture.center.x = 0.5;
texture.center.y = 0.5;
// ...생략...
```

위와 같이 중심을 면의 한 가운데로 옮기게 되면, 해당 좌표를 중심으로 회전하게 됩니다.

## 💻 Mips and Filtering

![mip-map-1](/assets/img/three-js-texture/mip-map-1.png)

위 이미지는 `PlaneGeometry` 에 `16x16` 크기의 `texture` 를 적용한 후, `camera` 를 `mesh` 와 거의 평행하게 위치시킨 모습입니다.
`Camera` 에서 멀리 떨어진 `texture` 일수록 흐려지는 현상을 볼 수 있는데 이는 `filter` 과 `mip mapping` 때문입니다.

### 👨‍💻 Mip mapping

`Mip mapping` 은 렌더링 성능을 최적화 하기 위해, 원본 `texture` 의 크기를 축소시킨 `texture` 들의 복사본들(`mips`)의 집합(`mip map`)을 사전에 만드는 과정을 의미합니다.

![mipmap-low-res-enlarged](/assets/img/three-js-texture/mipmap-low-res-enlarged.png)

위 그림은 `16 x 16` 크기의 원본 `texture` 를 축소시킨 `mip map` 입니다.  
`16 x 16` ⇒ `8 x 8` ⇒ `4 x 4` ⇒ `2 x 2` ⇒ `1 x 1` 와 같이 높이와 넓이를 절반으로 줄여가며 축소시킨것을 알 수 있으며, `1 x 1` 크기의 `mip` 을 얻을 때 까지 축소시킨다는 것을 알 수 있습니다.

### 👨‍💻 Filtering

렌더링 해야하는 `texture` 가 원본 크기보다 크거나, 작을 경우 원본 그대로 렌더링할 수 없습니다. 이 경우 렌더링해야하는 적절한 픽셀값을 결정해야 하는데 이 과정을 `filtering` 이라고 합니다.

#### 🖊 Magnification Filter

`texture` 의 크기가 원본 보다 커져야 하는 경우, 즉 원본 `texture` 가 `mesh` 보다 작을 경우 사용하는 `filter` 입니다.  
이 상황에는 `texel` (`texture` 의 1px) 이 하나 이상의 픽셀을 커버해야 합니다.

- `THREE.LinearFilter`  
  가장 가까운 4개의 픽셀을 골라, 각 픽셀의 실제 거리에 따라 적절한 비율로 섞는 방식입니다.  
  `three.js` 에서는 기본값으로 적용되어 있습니다.

  ```javascript
  // ...생략...
  const texture = textureLoader.load("small-image-path");
  texture.magFilter = THREE.LinearFilter;
  // ...생략...
  ```

  위 코드는 아주 작은 이미지를 `texture` 로 불러온 후, `magnification filter` 로 `LinearFilter` 를 적용해준 코드로, 결과는 아래와 같습니다.

  ![mag-linear-filter](/assets/img/three-js-texture/mag-linear-filter-1.png)

- `THREE.NearestFilter`  
  `texture` 에서 가장 가까운 픽셀을 골라 렌더링 합니다. 해상도가 낮은 `texture` 에 적용할 경우 픽셀화 됩니다.

  ```javascript
  // ...생략...
  const texture = textureLoader.load("small-image-path");
  texture.magFilter = THREE.NearestFilter;
  // ...생략...
  ```

  위 예시는 `NearestFilter` 를 적용한 코드이고 결과는 아래와 같습니다.

  ![mag-nearest-filter-1](/assets/img/three-js-texture/mag-nearest-filter-1.png)

  `texture` 각 픽셀화 된 것을 볼 수 있습니다.

#### 🖊 Minification Filter

`texture` 가 원본보다 작아져야 할 경우, 즉 원본 `texture` 가 `mesh` 보다 클 경우 사용하는 `filter` 입니다.  
이 경우는 `texel` 이 최대 한개의 픽셀을 커버하게 됩니다.

- `THREE.NearestFilter`  
  `Magnification filter` 와 마찬가지로 가장 가까운 픽셀을 골라 렌더링 합니다.

- `THREE.LinearFilter`  
  `Magnification filter` 와 마찬가지로 주변의 가까운 픽셀 4개을 골라 적절한 비율로 섞습니다.

- `THREE.NearestMipmapNearestFilter`  
  적절한 `mip` 을 고른 후, `mip` 에서 픽셀 하나를 선택합니다.

- `THREE.NearestMipmapLinearFilter`  
  두 개의 `mip` 을 골라 픽셀을 하나씩 선택한 후, 두 개의 픽셀을 적절한 비율로 섞습니다.

- `THREE.LinearMipmapNearestFilter`  
  적절한 밉을 고른 뒤 네 개의 픽셀을 골라 섞습니다.

- `THREE.LinearMipmapLinearFilter`  
  두 개의 `mip` 을 골라 각각 픽셀을 4개씩 선택하고, 선택한 8개의 픽셀을 섞습니다.  
  `three.js` 의 기본값으로 설정되어 있습니다.

![mini-filter-compare](/assets/img/three-js-texture/mini-filter-compare.gif)

위 이미지는 아래와 같이, `mip` 의 각 단계가 다른 `texture` 에 여섯개의 `minification filter` 를 적용한 예시입니다.

![different-mip-maps](/assets/img/three-js-texture/different-mip-maps.png)

위의 예시에서 `NearestFilter` 와 `LinearFilter` 를 살펴보면, 항상 원본 `texture` 를 렌더링하는 것으로 보아 `mipmap` 을 사용하지 않음을 알 수 있습니다.
GPU가 원본 `texture` 를 사용하기 때문에 멀리 떨어질수록 깜빡거림을 관찰할 수 있습니다.  
나머지 4개의 `filter` 는 모두 `mipmap` 을 사용하기 때문에 시점에 따라 렌더링 되는 `texture` 가 달라집니다.
`LinearMipmapLinearFilter` 가 가장 자연스러우나, 2개의 `mip` 에서 각각 4개의 픽셀을 가져오기때문에 계산량이 많아진다는 단점이 있습니다.

`NearestFilter` 와 `LinearFilter` 는 `mipmap` 을 사용하지 않기 때문에 아래와 같이 `mipmap` 생성을 비활성화 시키면 GPU의 부하를 조금 줄일 수 있습니다.

```javascript
// ...생략...
texture.generateMipmaps = false;
// ...생략...
```

#### 📔 참고자료

[How to make photorealistic 3D graphics with different texture maps?](https://www.webdew.com/blog/how-to-make-photorealistic-3d-graphics)  
[A Brief Introduction to Texture mapping for 3D Artists](https://professional3dservices.com/blog/texture-mapping-guide.html)  
[Texture Maps: The Ultimate Guide For 3D Artists](https://conceptartempire.com/texture-maps/)  
[UV Unwrapping](https://learn.foundry.com/nuke/content/comp_environment/modelbuilder/uv_unwrapping.html)  
[What is UV Mapping & Unwrapping? (full beginners guide)](https://inspirationtuts.com/what-is-uv-mapping-and-unwrapping/)  
[\[포프의 쉐이더 입문강좌\] 03. 텍스처매핑 Part 1](https://blog.popekim.com/ko/2011/12/12/intro-to-shader-03-texture-mapping-part-1.html)  
[What is mipmap technique and what's the benefit of using it in rendering?](https://developer.arm.com/documentation/ka005281/latest/)
