---
title: three.js 물체 변형하기
date: 2023-09-27
categories: [three.js, WebGL]
tags: [three.js]
image:
  path: /assets/img/three-js-main.png
  alt: three-js-logo
---

## 💻 Transform 속성

`CSS` 의 `transform` 속성 값으로 `translate`, `scale`, `rotate` 를 지정해 줌으로써 이동, 확대/축소, 회전의 효과를 줄 수 있습니다.
`three.js` 도 `CSS` 와 마찬가지로 비슷한 효과를 낼 수 있습니다.

`three.js` 의 `Object3D` 클래스를 상속받는 모든 객체들(`mesh`, `camera` 등)은 다음의 4가지 속성을 가집니다.

> `position`, `scale`, `rotation`, `quaternion`

이 속성들은 물체 변형과 관련된 속성으로, 적절한 값을 지정해 변형을 줄 수 있습니다.

## 💻 물체 이동

`Object3D` 의 `position` 속성을 이용해 물체를 이동시킬 수 있습니다.  
`position` 속성은 `Vector3` 라는 타입을 갖습니다. `Vector3` 클래스는 3차원 벡터를 의미합니다. 즉 3차원 공간에서의 좌표와, 벡터의 방향 및 크기를 나타냅니다.

`Vector3` 에는 `x`, `y`, `z` 속성이 있는데 이 속성들의 값을 설정해 물체의 위치를 변경할 수 있습니다.

![position-1](/assets/img/three-js-transform/position-1.png)

위 이미지는 원점에 렌더링된 `mesh` 에 각각 `mesh.position.x = 1`, `mesh.position.y = 1`, `mesh.position.z = 1` 을 적용시킨 모습입니다. 위 결과를 통해 `three.js` 는 아래와 같은 좌표축을 기본으로 가진다는 것을 알 수 있습니다.

![colored-coordinate-axis](/assets/img/three-js-transform/colored-coordinate-axis.png)

`x` 축은 좌우, `y` 축은 상하, `z` 축은 전후를 가리키며, 이 축의 방향은 변경될 수 있습니다.

### 👨‍💻 AxesHelper

물체를 변형하다보면, 좌표축을 생각하기 어려울 수 있는데, `AxesHelper` 를 추가하면 현재 축을 확인할 수 있습니다.

```javascript
// ...생략...

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// ...생략...
```

위 예시코드를 적용하면, 아래와 같은 결과를 얻을 수 있습니다.

![axes-helper-1](/assets/img/three-js-transform/axes-helper-1.png)

각 축의 양의 방향만 표현이 되었으며, 초록색은 `y`, 빨간색은 `x`, 파란색은 `z` 축을 의미합니다.  
`AxesHelper` 의 생성자 인자로 축의 길이를 넘겨줄 수 있습니다. 또한 `AxesHelper` 는 `scene` 에 추가할 수도 있지만, `Object3D` 에도 추가할 수 있습니다.

### 👨‍💻 유용한 메소드들

`Object3D` 의 `position` 속성의 타입은 `Vector3` 이기때문에, `Vector3` 클래스에 정의된 메소드를 사용할 수 있습니다.

- `set(x: Float, y: Float, z: Float): Vector3`  
  `x`, `y`, `z` 벡터를 한번에 설정할 수 있는 메소드 입니다.

  ```javascript
  // ...생략...
  mesh.position.x = 1;
  mesh.position.y = 1;
  mesh.position.z = 1;
  // ...생략...
  ```

  위 코드를 `set` 을 사용해 간단히 표현할 수 있습니다.

  ```javascript
  // ...생략...
  mesh.position.set(1, 1, 1);
  // ...생략...
  ```

- `length(): Float`  
  `(0, 0, 0)` 에서 `(x, y, z)` 까지의 직선거리를 구하는 메소드 입니다.

  ```javascript
  // ...생략...
  mesh.position.set(1, 1, 1);
  console.log(mesh.position.length()); // 1.73205080...
  ```

  `mesh` 를 `x`, `y`, `z` 축으로 1 만큼 이동시킨 후, 원점과의 거리를 구하면 `1.732...` 라는 값이 나옵니다.
  이 값은 `new THREE.Vector3(1, 1, 1)` 의 거리과 같은 값입니다.

- `distanceTo(v: Vector3): Float`  
  `length` 가 원점과의 거리를 구하기위해 사용되었다면, `distanceTo` 는 다른 벡터와의 거리를 구하기위해 사용됩니다.

  ```javascript
  // ...생략...
  console.log(mesh.position.distanceTo(camera.position)); // 2.4494...
  // ...생략...
  ```

  위 예시는 `mesh` 와 `camera` 와의 직선거리를 구하는 코드입니다.  
   `Mesh` 의 좌표는 `(1, 1, 1)` 이고 `camera` 의 좌표는 `(0, 0, 3)` 이므로 `new THREE.Vector3(1, 1, 1).distanceTo(new THREE.Vector3(0, 0, 3))` 과 같은 값입니다.

- `normalize(): Vector3`  
  현재의 벡터를 방향은 유지한채 단위벡터(크기가 1인 벡터)로 변환하는 함수 입니다.

  ```javascript
  // ...생략...
  mesh.position.set(1, 1, 1);
  console.log(mesh.position.length()); // 1.732...

  mesh.position.normalize();
  console.log(mesh.position.length()); // 1
  // ...생략...
  ```

  `normalize` 함수를 실행한 후 `mesh` 의 원점과의 거리가 1 이 되었음을 볼 수 있습니다.

#### 📔 참고자료

[Object3D](https://threejs.org/docs/#api/en/core/Object3D)  
[Vector3](https://threejs.org/docs/index.html#api/en/math/Vector3)
