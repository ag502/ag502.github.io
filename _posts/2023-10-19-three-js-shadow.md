---
title: three.js shadow 살펴보기
date: 2023-10-19
categories: [three.js, WebGL]
tags: [three.js]
image:
  path: /assets/img/three-js-main.png
  alt: three-js-logo
---

## 💻 그림자를 만드는 원리

`three.js` 에서는 그림자를 만들기 위해 `Shadow Map` 을 이용합니다.  
`Shadow Map` 이란 그림자 정보를 저장할 `texture` 를 의미하며, 만들어지는 과정과 이를 이용해 그림자를 렌더링하는 과정은 다음과 같습니다.

1. `scene` 을 렌더링하기 직전에, `light` 의 시점에서 렌더링을 먼저 합니다.

2. 이때, `mesh` 들의 `material` 은 `MeshDepthMaterial` 로 변경됩니다.

3. `Light` 의 시점에서 렌더링된 `scene` 은 `Shadow Map` 이라고 불리는 `texture` 에 저장됩니다.

4. 만들어진 `Shadow Map` 들을 종합해 최종 `scene` 을 렌더링합니다.

20개의 `mesh` 와 5개의 `light` 들이 있다면, 총 6번 렌더링이 일어나게 됩니다.
5개의 `light` 시점에서 한번씩, 이 과정에서 나온 `Shadow Map` 들을 합쳐 최종적으로 한번 렌더링이 발생하기 때문입니다.  
만약 조명하나를 더 추가한다면, 7번 렌더링 후에 최종 결과가 나오게 됩니다.

다음은 `light` 별로 만들어진 `Shadow Map` 을 시각화한 예시입니다.  
[shadow_map_viewer](https://threejs.org/examples/webgl_shadowmap_viewer.html)

## 💻 그림자 만들기

그림자를 만들기 위해서는 먼저 `renderer` 의 `shadowMap` 을 활성화 시켜주어야 합니다.

```javascript
renderer.shadowMap.enabled = true;
```

또한 `Object3D` 가 그림자를 만드는지(`Shadow Map` 생성), 만들어진 그림자가 맽히는지에 따라 `castShadow` 와 `receiveShadow` 옵션을 활성화 시켜주어야 합니다.

```javascript
mesh1.castShadow = true;
mesh2.receiveShadow = true;
```

추가로 앞서 살펴본 조명들중 `DirectionalLight`, `SpotLight`, `PointLight` 만 그림자를 만들 수 있습니다.

### 👨‍💻 DirectionalLight

```javascript
// ...생략...
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
// ...생략...
planeMesh.receiveShadow = true;

cubeMesh.castShadow = true;
cubeMesh.receiveShadow = true;

sphereMesh.castShadow = true;
sphereMesh.receiveShadow = true;
// ...생략...
```

위 코드는 `DirectionalLight` 를 이용하여 `Mesh` 에 그림자들을 생성하는 코드입니다.  
그림자를 만들기 위해서 조명에 `castShadow` 옵션을 활성화 해준것을 알 수 있습니다. 또한 그림자가 맽힐 `planeMesh` 에는 `receiveShadow` 옵션을, 그림자가 생성될 `cubeMesh` 와 `sphereMesh` 에는 `receiveShadow` 옵션을 활성화 했습니다.

아래는 위코드를 실행시킨 결과입니다.

![directional-light-shadow-1](/assets/img/three-js-shadow/directional-light-shadow-1.png)

#### 🖊 그림자 최적화하기

조명에 의해 만들어진 그림자는 상황에 따라 최적화를 해야할 필요가 있습니다.  
위 결과에서도 그림자가 잘려 생성된 것을 볼 수 있는데, 아래에서 살펴볼 요소를 따라 최적화를 시켜보겠습니다.

- `camera`  
  `Shadow Map` 을 만들때 `light` 의 시점에서 렌더링을 진행하는데, 이때 `light` 의 `camera` 를 이용하게 됩니다.
  이 `camera` 는 `scene` 을 렌더링하는 `camera` 와 같은 객체입니다. 따라서 `CameraHelper` 로 시각화 할 수 있으며, 그 결과는 아래와 같습니다.

  ![directional-light-shadow-2](/assets/img/three-js-shadow/directional-light-shadow-2.png)
  위 결과를 통해, `DirectionalLight` 의 `camera` 는 `OrthographicCamera` 임을 알 수 있습니다.

  `camera` 를 통해 최적화 할 수 있는 요소는 렌더링 범위 입니다. 렌더링 범위가 작아질 수록, 그림자는 정교해지지만, 너무 작아지면 그림자가 잘리게 됩니다.  
  위 이미지에서는 후자에 해당하니 범위를 넓혀보겠습니다.

  ```javascript
  // ...생략...
  directionalLight.shadow.camera.top = 3;
  directionalLight.shadow.camera.bottom = -8;
  directionalLight.shadow.camera.left = -7;
  directionalLight.shadow.camera.right = 7;
  // ...생략...3
  ```

  ![directional-light-shadow-3](/assets/img/three-js-shadow/directional-light-shadow-3.png)

  추가로 `near`, `far` 도 범위에 맞게 조절해보겠습니다.

  ```javascript
  // ...생략...
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 15;
  // ...생략...
  ```

  ![directional-light-shadow-4](/assets/img/three-js-shadow/directional-light-shadow-4.png)

- Render Size  
  `Shadow Map` 은 일종의 `texture` 로, 크기를 지정할 수 있습니다.  
  값이 클수록, 그림자가 정교해지지만, 연산량이 많아져 성능이 떨어질 수 있습니다.
  또한 값은 `mipmap` 생성을 위해 `2` 의 거듭제곱으로 설정해주어야 합니다.

  ```javascript
  // ...생략...
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  // ...생략...
  ```

- Shadow Map Type

  |       타입       |                                                        특징                                                        |
  | :--------------: | :----------------------------------------------------------------------------------------------------------------: |
  |  BasicShadowMap  |                                          성능은 좋지만, 품질이 낮습니다.                                           |
  |   PCFShadowMap   |                 기본값으로, 부드러운 테두리를 가진 그림자를 얻을 수 있지만 성능은 조금 떨어집니다.                 |
  | PCFSoftShadowMap | 부드러운 그림자를 얻을 수 있으며, <br> 특히 저 해상도의 `Shadow Map` 일 때, 더욱 부드러워 집니다. 성능은 낮습니다. |
  |   VSMShadowMap   |      해당 타입을 사용하려면, <br> `receiveShadow` 가 활성화된 객체들은 `castShadow` 옵션을 활성화 해야합니다.      |

- `blur`  
  `radius` 속성을 통해 그림자 테두리에 흐린(`blur`) 효과를 줄 수 있습니다.  
  값이 `1` 보다 크면 효과가 적용되며, `Shadow Map` 의 `type` 이 `PCFSoftShadowMap` 나 `BasicShadowMap` 일 경우는 적용되지 않습니다.

  ```javascript
  // ...생략...
  directionalLight.shadow.radius = 10;
  // ...생략...
  ```

  ![directional-light-shadow-5](/assets/img/three-js-shadow/directional-light-shadow-5.png)

### 👨‍💻 SpotLight

```javascript
// ...생략...
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.castShadow = true;
// ...생략...
```

위 코드를 이용하여 `SpotLight` 에 그림자를 생성한 결과는 다음과 같습니다.

![spot-light-shadow-1](/assets/img/three-js-shadow/spot-light-shadow-1.png)

#### 🖊 그림자 최적화하기

그림자를 최적화하는 방법은 `DirectionalLight` 와 거의 비슷합니다.  
이 부분에서는 다른점을 위주로 서술하겠습니다.

- `camera`  
  `SpotLight` 는 그림자를 만들기 위해 `PerspectiveCamera` 를 사용합니다. `CameraHelper` 를 통해 시각화한 결과는 아래와 같습니다.

  ![spot-light-shadow-2](/assets/img/three-js-shadow/spot-light-shadow-2.png)

  `SpotLight` 의 `camera` 의 `fov` 는 `angle` 과 연결되어 있으며, `aspect` 는 `Shadow Map` 의 크기에 따라 자동으로 정해지게 됩니다.
  따라서 `near` 와 `far` 를 조절할 수 있습니다.

### 👨‍💻 PointLight

```javascript
// ...생략...
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.castShadow = true;
// ...생략...
```

위 코드를 실행한 결과는 아래와 같습니다.

![point-light-shadow-1](/assets/img/three-js-shadow/point-light-shadow-1.png)

#### 🖊 그림자 최적화하기

- `camera`  
  `PointLight` 는 그림자를 만들기 위해 `PerspectiveCamera` 를 사용합니다.  
  `PointLight` `camera` 의 `near` 와 `far` 속성을 조정해 렌더링 범위를 설정할 수 있습니다.

  ![point-light-shadow-3](/assets/img/three-js-shadow/point-light-shadow-3.png)

  `SpotLight` 와 같은 `camera` 를 사용하지만, 차이점은 `PointLight` 는 모든 방향으로 빛을 발산하기 때문에 정육면체의 각면에 조명을 놓은것과 같습니다.
  즉 `PointLight` 는 정육면체 각 방향으로 6번을 렌더링해야 함으로 다른 조명보다 성능이 떨어집니다.

## 💻 가짜 그림자 만들기

위에서 살펴보았듯이, 그림자를 만드는 과정은 까다롭고 비용도 큽니다.  
그림자 형태의 `texture` 를 이용하면, 복잡한 연산 없이도 그림자가 생기는 효과를 낼 수 있습니다.
해당 `texture` 를 입힌 `PlaneGeometry` 를 그림자가 생겨야하는 위치에 두면 됩니다.

![fake-shadow](/assets/img/three-js-shadow/fake-shadow.png)

위 `texture` 를 이용해서 구현해보겠습니다.

```javascript
// ...생략...

// Fake Shadow
const fakeShadowGeometry = new THREE.PlaneGeometry(6, 6);
const fakeShadowMaterial = new THREE.MeshBasicMaterial({
  alphaMap: fakeShadowTexture,
  transparent: true,
  color: 0x000000,
});

const fakeShadow = new THREE.Mesh(fakeShadowGeometry, fakeShadowMaterial);

fakeShadow.position.set(0, 0.01, 0);
fakeShadow.rotation.set(-(Math.PI * 0.5), 0, 0);
// ...생략...
```

위 코드는 `PlaneGeometry` 에 그림자 `texture` 를 적용시킨 후, 시계방향으로 회전시키는 코드입니다.  
`y` 축을 `0` 보다 미세하게 크게 설정해준 이유는, `z-fighting` 때문입니다.

위 코드를 실행시킨 결과는 다음과 같습니다.

![fake-shadow-2](/assets/img/three-js-shadow/fake-shadow-2.png)
`Sphere` 부분의 그림자가 생겼음을 알 수 있습니다.

이 방식의 문제점은, 그림자가 움직이지 않는다는 점입니다. `Light` 에 의한 그림자가 아니기 때문에 `mesh` 가 움직여도 그림자는 원래의 자리를 유지합니다.
또한, `mesh` 의 거리와 상관없이 항상 같은 그림자가 나옵니다.

먼저 `mesh` 가 지면에서 멀어짐에 따라, 그림자가 다르게 렌더링 될 수 있도록 구현해보겠습니다.

```javascript
// ...생략...
const animation = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3) * 5) + 3;
  fakeShadow.material.opacity = 1 - sphere.position.y * 0.05;

  renderer.render(scene, camera);

  requestAnimationFrame(animation);
};

requestAnimationFrame(animation);
// ...생략...
```

`Sphere` 가 멀어짐에 따라(`y` 좌표가 커짐에 따라), 그림자의 투명도는 `0` 에 가까워져야 함으로 `1` 에서 빼준것을 볼 수 있습니다.  
위 코드를 실행시킨 결과는 다음과 같습니다.

![fake-shadow-3](/assets/img/three-js-shadow/fake-shadow-3.gif)

다음으로 `Mesh` 의 움직임과 그림자 `texture` 를 적용한 `Mesh` 간의 위치를 동기화 시켜보겠습니다.

```javascript
// ...생략...
const animation = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.position.x = Math.sin(elapsedTime * 5);
  sphere.position.z = Math.cos(elapsedTime * 5);
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3) * 5) + 3;

  fakeShadow.position.x = sphere.position.x;
  fakeShadow.position.z = sphere.position.z;
  fakeShadow.material.opacity = 1 - sphere.position.y * 0.05;

  renderer.render(scene, camera);

  requestAnimationFrame(animation);
};

requestAnimationFrame(animation);
// ...생략...
```

`Sphere` 의 원운동에 의해 바뀐 좌표를, 그림자 `texture` 가 적용된 `mesh` 에 적용해 줌으로써 두 `mesh` 사이의 위치를 동기화 해주는 코드입니다.  
결과는 다음과 같습니다.

![fake-shadow-4](/assets/img/three-js-shadow/fake-shadow-4.gif)

#### 📗 참고자료

[Shadows](https://threejs.org/manual/#en/shadows)
