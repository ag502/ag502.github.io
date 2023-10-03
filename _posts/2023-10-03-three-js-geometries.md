---
title: three.js geometry 살펴보기
date: 2023-10-03
categories: [three.js, WebGL]
tags: [three.js]
image:
  path: /assets/img/three-js-main.png
  alt: three-js-logo
---

## 💻 Geometry 란?

`three.js` 에서 `geometry` 는 3차원 공간에서의 좌표들을 의미하는 정점들(vertices)과 그 정점들을 연결해 만든 삼각형 모양의 면(face)들로 이루어진 모양(shape) 입니다.  
보통 `geometry` 는 `mesh` 를 구성하지만, 점으로 된 도형을 구성할 수도 있습니다. 또한 하나의 정점(vertex)은 좌표 정보뿐만 아니라 `normal`, `color`, `uv` 와 같은 정보도 저장할 수 있습니다.

## 💻 원시 모델(Primitive Model)

`three.js` 에는 기본으로 제공하는 원시모델이 존재합니다. 각 원시모델들은 런타임에 다양한 인자를 받아 모양을 형성합니다. 또한 모든 원시 타입들은 `BufferGeometry` 클래스를 상속받습니다.

### 👨‍💻 종류

[문서 참조](https://threejs.org/manual/#en/primitives)

### 👨‍💻 BoxGeometry

원시 모델에는 다양한 인자들이 있는데, 육면체를 예시로 인자들의 의미를 살펴보겠습니다.

> <span style="color:cyan;">BoxGeometry(width: Float, height: Float, depth: Float, widthSegments: Integer, heightSegments: Integer, depthSegments: Integer)</span>

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
```

`BoxGeometry` 는 위와 같이 6개의 인자를 받고있는데, 각 인자는 아래와 같은 의미를 갖습니다.

- `width`  
  육면체의 넓이, 즉 `x` 축에 평행한 모서리의 길이입니다.

- `height`  
  육면체의 높이, 즉 `y` 축에 평행한 모서리의 길이입니다.

- `depth`  
  육면체의 깊이, 즉 `z` 축과 평행한 모서리의 길이입니다.

- `widthSegments`  
  `x` 축을 따라 분할된 직사각형 면의 수 입니다.

- `heightSegments`  
  `y` 축을 따라 분할된 직사각형의 면의 수 입니다.

- `depthSegments`  
  `z` 축을 따라 분할된 직사각형의 면의 수 입니다.

![width-height-depth](/assets/img/three-js-geometries/width-height-depth.png)

위 이미지는 `width`, `height`, `depth` 속성을 각각 2로 증가시킨 후 렌더링된 `BoxGeometry` 입니다.

![segment](/assets/img/three-js-geometries/segment.png)

위 결과는 아래의 코드를 실행시킨 결과입니다.

```javascript
// ...생략...
const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(boxGeometry, material);
// ...생략...
```

분할된 여부를 확인하기 위해 `material` 에 `wireframe` 옵션을 `true` 설정한 것을 알 수 있습니다.

`widthSegments` 를 `2` 로 설정하게되면, `x` 축 방향(넓이)으로 사각형을 이등분했음을 알 수 있습니다. `heightSegments` 와 `depthSegments` 도 같은 방식으로 동작합니다.

`segment` 가 증가하면, 곡선 표현에 유리해집니다. 평면은 `segment` 의 갯수와 무과하지만, 구의 경우 `segment` 의 갯수가 증가할 수록 완벽한 구에 가까워 집니다.

## 💻 사용자 지정 BufferGeometry

`BufferGeometry`는 `three.js` 내의 모든 `geometry`를 나타냅니다 (원시 모델의 부모 클래스). 또한 `BufferAttribute` 속성들의 집합이라고 할 수 있습니다.  
`BufferGeometry` 로 직접 `geometry` 를 만들기 위해서는 정점들을 추가해주어야 합니다. 정점들을 추가해주기 위해서는 배열을 사용해야하는데, 이때 [`Float32Array`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Float32Array) 를 사용합니다.

`BufferGeometry` 를 이용해서 육면체를 만들어보겠습니다.

```javascript
// ...생략...
const vertices = [
  -1, -1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1, 1, -1,
  -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, 1, 1, -1, 1,
  1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, -1, -1, 1, -1, -1,
  -1, 1, -1, 1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1, 1,
  1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1,
];

const myBoxPositionAttribute = new THREE.BufferAttribute(
  new Float32Array(vertices),
  3
);
const boxGeometry = new THREE.BufferGeometry();
boxGeometry.setAttribute("position", myBoxPositionAttribute);

const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const mesh = new THREE.Mesh(boxGeometry, material);
// ...생략...
```

정육면체를 만들기 위해 `vertices` 배열에 108개의 원소가 들어있습니다. 정육면체의 면은 모두 6개이고, 한 면이 2개의 삼각형으로 되어있으니 총 12개의 삼각형이 필요합니다.
12개의 삼각형 꼭지점은 모두 36개이고 각 점은 `(x, y, z)` 좌표의 정보가 들어있어 108개(6 X 2 X 3 X 3)의 원소가 됩니다.

좌표의 정보를 담은 `vertices` 배열을 `Float32Array` 로 변경시킨 후, 좌표와 관련된 `BufferAttribute` 을 생성하고 있습니다. 이 때 두번째 인자로, `3` 을 전달했는데, 이는 백터의 갯수를 의미합니다. 예를 들어, 위의 `vertices` 의 경우 좌표에 3개의 백터 `(x, y, z)` 를 가지고 있기때문에 `3` 을 전달해주었습니다.

![position-attribute-1](/assets/img/three-js-geometries/position-attribute-1.png)

좌표의 `BufferAttribute` 를 생성한 후, `setAttribute` 를 이용해 `BufferGeometry` 에 추가를 해주어야 합니다.

❗️ `BufferGeometry` 의 `attribute` 에 접근할때는 직접 접근보다는 `getter` 와 `setter` 메소드를 사용하는 것이 빠릅니다.

### 👨‍💻 Vertex에 다른 정보 저장하기

위에서 언급한대로, 정점에는 `uv`, `normal`, `color` 와 같은 정보도 저장할 수 있습니다.

```javascript
// ...생략...
const vertices = [
  // 앞쪽
  { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0] },
  { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] },
  { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] },
  { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] },
  { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] },
  { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1] },
  // 오른쪽
  { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0] },
  { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] },
  { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] },
  { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] },
  { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] },
  { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1] },
  // 뒤쪽
  { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0] },
  { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] },
  { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] },
  { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] },
  { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] },
  { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1] },
  // 왼쪽
  { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0] },
  { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] },
  { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] },
  { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] },
  { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] },
  { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1] },
  // 상단
  { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0] },
  { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] },
  { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] },
  { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] },
  { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] },
  { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1] },
  // 하단
  { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0] },
  { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] },
  { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] },
  { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] },
  { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] },
  { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1] },
];

const positions = [];
const normals = [];
const uvs = [];

for (const vertex of vertices) {
  positions.push(...vertex.pos);
  normals.push(...vertex.norm);
  uvs.push(...vertex.uv);
}

const geometry = new THREE.BufferGeometry();

geometry.setAttribute(
  "position",
  new BufferAttribute(new Float32Array(positions), 3)
);
geometry.setAttribute(
  "normal",
  new BufferAttribute(new Float32Array(normals), 3)
);
geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
// ...생략...
```

![threejs-attributes-1](/assets/img/three-js-geometries/threejs-attributes-1.png)

위 코드는, 좌표의 위치 외의 정보를 `BufferAttribute` 로 추가한 예시입니다.

## 💻 index

`BufferGeometry` 로 `geometry` 를 만들기 위한 `vertices` 배열에는 중복되는 정점이 있습니다.  
위에서 만든 정육면체를 살펴보면, 한 면은 두개의 삼각형으로 구성되어있고 총 6개의 정점이 생깁니다. 이중에서 2개의 정점이 중복됩니다.
계산의 효율성을 위해 중복되는 정점들을 제거하고 각, 좌표의 인덱스를 확용해 `geometry` 를 생성할 수 있습니다.

```javascript
// ...생략...
const vertices = [
  // 앞쪽
  { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0] }, // 0
  { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] }, // 1
  { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] }, // 2

  { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1] }, // 3
  // 오른쪽
  { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0] }, // 4
  { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] }, // 5

  { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] }, // 6
  { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1] }, // 7
  // 뒤쪽
  { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0] }, // 8
  { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] }, // 9

  { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] }, // 10
  { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1] }, // 11
  // 왼쪽
  { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0] }, // 12
  { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] }, // 13

  { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] }, // 14
  { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1] }, // 15
  // 상단
  { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0] }, // 16
  { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] }, // 17

  { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] }, // 18
  { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1] }, // 19
  // 하단
  { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0] }, // 20
  { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] }, // 21

  { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] }, // 22
  { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1] }, // 23
];

geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, positionNumComponents));
geometry.setAttribute(
    'normal',
    new THREE.BufferAttribute(normals, normalNumComponents));
geometry.setAttribute(
    'uv',
    new THREE.BufferAttribute(uvs, uvNumComponents));
 
geometry.setIndex([
   0,  1,  2,   2,  1,  3,  // 앞쪽
   4,  5,  6,   6,  5,  7,  // 오른쪽
   8,  9, 10,  10,  9, 11,  // 뒤쪽
  12, 13, 14,  14, 13, 15,  // 왼쪽
  16, 17, 18,  18, 17, 19,  // 상단
  20, 21, 22,  22, 21, 23,  // 하단
]);

// ...생략...
```

#### 📔 참고자료

[Primitives](https://threejs.org/manual/#en/primitives)  
[Custom BufferGeometry](https://threejs.org/manual/#en/custom-buffergeometry)  
[Three.js: Geometries and materials](https://blog.logrocket.com/three-js-geometries-and-materials/)
