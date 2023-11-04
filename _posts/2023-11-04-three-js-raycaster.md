---
title: three.js Raycaster 살펴보기
date: 2023-10-28
categories: [three.js, WebGL]
tags: [three.js]
image:
  path: /assets/img/three-js-main.png
  alt: three-js-logo
---

## 💻 Ray Casting 이란?

`Ray Casting` 은 가상의 광선(ray)을 쏴서, 어떤 물체와 교차하는지 확인하는 기술입니다.
해당 기법을 사용하여, 충돌 감지, 물체의 선택 및 상호작용, 가려진 면 판별등을 구현할 수 있습니다.

## 💻 Raycaster 만들기

> <span style="color:cyan;">Raycaster( origin : Vector3, direction : Vector3, near : Float, far : Float )</span>

`three.js` 에서 `Raycaster` 는 위 생성자를 이용해서 만들 수 있습니다. 생성자 각각의 인자들은 다음과 같습니다.

- `origin`  
  `Ray` (광선)가 시작되는 좌표로 `Vector3` 형식을 갖습니다.
- `direction`  
  `Ray` 의 방향을 나타내는 `Vector3` 좌표로, 반드시 `normalize` 함수를 호출해 정규화 시켜야 합니다.
- `near`  
   최솟값을 지정하는 인자로, 반환된는 모든 결과들은 `near` 에서 설정한 값보다 큽니다.  
  기본값은 `0` 이며, 음수는 될 수 없습니다.
- `far`
  최댓값을 지정하는 인자로, 결과들은 `far` 의 값보다 클 수 없습니다.  
  기본값은 무한대 입니다.

```javascript
// ...생략...
const rayOrigin = new THREE.Vector3(-5, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();

const raycaster = new THREE.Raycaster(rayOrigin, rayDirection);
// ...생략...
```

위 코드는 시작점이 `(-5, 0, 0)` 이며 방향이 `(10, 0, 0)` 을 향하는 `ray` 를 만든 예시입니다.  
`rayDirection` 이 단위벡터가 아니므로 `normalize` 를 실행한 것을 볼 수 있습니다.

`RayCaster` 를 생성할 때, 생성자가 아닌 `set` 함수를 이용하여 만들 수도 있습니다.

```javascript
// ...생략...
const raycaster = new THREE.Raycaster();

const rayOrigin = new THREE.Vector3(-5, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();

rayCaster.set(rayOrigin, rayDirection);
// ...생략...
```

## 💻 Raycaster를 활용하여 교차하는 물체 찾기

`Raycaster` 의 `ray` 와 교차하는 물체를 찾기 위해서는, `intersectObject` 와 `intersectObjects` 메소드를 이용해야 합니다. 두 함수의 차이는 `ray` 와 교차됨을 판별하는 물체가 단수이나, 복수이냐 입니다.

> <span style="color:cyan;">intersectObject(object: Object3D, recursive: Boolean, optionalTarget: Array): Array</span>

`intersectObject` 메소드 인자들의 의미는 아래와 같습니다.

- `object`  
  `Ray` 와 교차되는지를 판별할 `Object3D` 인스턴스 입니다
- `recursive`  
   `true` 로 설정할 경우, `ray` 와 `object` 인자의 모든 자손들이 교차하는지를 판별합니다.
  그렇지 않을 경우, `object` 인자만 판별합니다.  
  기본값은 `true` 입니다.
- `optionalTarget`  
   반환된 결과를 다른 배열에 저장하고 싶을 때, 지정하는 옵션입니다.  
  만약 해당 인자에 배열을 넘겨주었다면, 호출시마다 해당 배열을 비워야 합니다.

```javascript
// ...생략...
const mesh1 = new THREE.Mesh(
  boxGeometry,
  new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
);
mesh1.position.x = -1;

const mesh2 = new THREE.Mesh(
  boxGeometry,
  new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
);

const mesh3 = new THREE.Mesh(
  boxGeometry,
  new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
);
mesh3.position.x = 1;

// ...생략...

const rayOrigin = new THREE.Vector3(-5, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();

const raycaster = new THREE.Raycaster(rayOrigin, rayDirection);
const intersect = raycaster.intersectObject(mesh1);
// ...생략...
```

위 코드는, 각각 `(-1, 0, 0)`, `(0, 0, 0)`, `(1, 0, 0)` 에 위치하는 너비 `0.5` 인 정육면체 세개 중, 제일 왼쪽의 정육면체와 `(-5, 0, 0)` 에서 `(10, 0, 0)` 방향으로 향하는 `ray` 와의 교차지점을 구하는 예시입니다.

![ray-caster-intersect-1](/assets/img/three-js-raycaster/ray-caster-intersect-1.png)

`intersect` 의 결과를 콘솔에 출력해보면 다음과 같이 나옵니다.

![ray-caster-intersect-2](/assets/img/three-js-raycaster/ray-caster-intersect-2.png)

결과가 두개임을 알 수 있습니다. 이는 `segment` 옵션을 설정하지 않고 정육면체를 생성할 때, 한면은 두개의 삼각형 `face` 로 구성되어 있는데, `ray` 가 두개의 삼각형이 맞닿은 곳을 통과하기 때문입니다. `Segment` 를 변경하게되면, 결과가 달라질 수 있습니다.

앞서 살펴보았듯, `intersectObject` 의 결괏값은 배열이며, `ray` 의 시작점과의 거리가 가까운 순으로 정렬됩니다. 원소의 객체 속성의 의미는 다음과 같습니다.

- `distance`  
   `Ray` 의 출발점과 교차점과의 거리를 나타내는 속성입니다.  
  위 예시에서, `ray` 의 출발점은 `(-5, 0, 0 )` 이며 교차되는 지점의 좌표는 `(-1.25, 0, 0)` (중심의 좌표가 `(-1, 0, 0)` 이고, 한변의 길이가 `0.5` 이기 때문), `3.75` 가 나왔습니다.
- `point`  
  교차점의 좌표를 의미합니다.
- `face`  
  교차되는 면(`face`) 의 정보를 나타냅니다.
- `faceIndex`  
  교차되는 면의 `index` 를 나타냅니다.
- `object`  
  `Ray` 와 교차된 `mesh` 의 정보를 나타냅니다.
- `uv`  
  교차점의 `uv` 좌표를 의미합니다.
- `uv1`  
  교차점에서의 두번째 `uv` 좌표를 의미합니다.
- `normal`  
  교차점에서의 `normal` 백터를 나타냅니다.
- `instanceId`  
  `Ray` 와 `InstancedMesh` 가 교차할때, 해당 인스턴스의 `index` 번호를 나타냅니다.

`intersectObject` 를 사용할 때, 주의할 점은 `mesh` 의 `face` 가 `ray` 의 시작점을 향해 있어야 한다는 점입니다.

```javascript
// ...생략...
const rayOrigin = new THREE.Vector3(-1, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();

const raycaster = new THREE.Raycaster(rayOrigin, rayDirection);
// ...생략...
const intersect = raycaster.intersectObject(mesh1);
// ...생략...
```

`Ray` 의 시작좌표를 제일 왼쪽 정육면체의 내부로 지정해 보겠습니다.

![ray-caster-intersect-3](/assets/img/three-js-raycaster/ray-caster-intersect-3.png)

위 코드에서 `intersect` 를 출력해보면, 빈배열이 출력됩니다. `Ray` 와 교차하는 `face` 가 시작점이 아닌 반대 방향을 향하고 있기 때문입니다.  
이를 해결하기 위해 `material` 의 `side` 옵션을 `THREE.DoubleSide` 로 설정하면 됩니다.

## 💻 Raycaster 를 활용하여 움직이는 물체 교차점 찾기

움직이는 물체의 교차점을 찾기위해서는 프레임마다 `intersectObject` 를 실행해 주어야 합니다.  
원운동 하는 `BoxGeometry` 가 `ray` 와 교차할 때, 색이 변하는 코드를 작성해 보겠습니다.

```javascript
// ...생략...
const clock = new THREE.Clock();
function animate() {
  const elapsedTime = clock.getElapsedTime();

  mesh1.material.color.set("red");

  mesh1.position.x = Math.sin(elapsedTime);
  mesh1.position.y = Math.cos(elapsedTime);

  const intersect = raycaster.intersectObject(mesh1);

  for (const intersectMesh of intersect) {
    intersectMesh.object.material.color.set("blue");
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
// ...생략...
```

위 코드를 실행한 결과는 다음과 같습니다.

![ray-caster-intersect-4](/assets/img/three-js-raycaster/ray-caster-intersect-4.gif)

## 💻 Raycaster 를 활용하여 포인터로 물체 상호작용하기

`Raycaster` 를 이용하여, 포인터 (PC 에서는 마우스)와 물체가 상호작용하도록 구현하는 방법을 알아보겠습니다.

상호작용하기 위해서는, 포인터의 좌표가 필요한데 픽셀좌표가 아닌 `-1` 에서 `1` 사이의 정규화된 좌표가 필요합니다.

```javascript
// ...생략...
const pointerCoord = new THREE.Vector2();

canvas.addEventListener("pointermove", (e) => {
  const { offsetX, offsetY } = e;

  pointerCoord.x = (offsetX / window.innerWidth) * 2 - 1;
  pointerCoord.y = -((offsetY / window.innerHeight) * 2 - 1);
});
// ...생략...
```

위 코드는 포인터의 좌표를 `-1` 과 `1` 사이의 값으로 정규화 시키는 코드입니다.  
포인터의 `x` 좌표를 캔버스의 넓이로 나누게 되면, 그 범위는 `0` 과 `1` 사이가 됩니다. 여기에 `2` 를 곱한 후 `1` 을 빼게되면 `-1` 과 `1` 이 됩니다.  
`y` 좌표에 `-1` 을 곱한 이유는 위쪽 방향이 양수이기 때문입니다.

![ray-caster-pointer-interact-1](/assets/img/three-js-raycaster/ray-caster-pointer-interact-1.png)

이제 `Ray` 를 정규화된 좌표를 향하도록 만들어야 하는데, 이때 사용하는 메소드가 `setFromCamera` 입니다.
이 함수는 시작점을 카메라의 위치로, 방향을 포인터로 하는 `ray` 를 생성하는 함수입니다.

```javascript
// ...생략...
let INTERSECTED = null;
function animate() {
  // ...생략...
  raycaster.setFromCamera(pointerCoord, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    if (INTERSECTED !== intersects[0].object) {
      if (INTERSECTED) INTERSECTED.material.color.set(INTERSECTED.currentColor);

      INTERSECTED = intersects[0].object;
      INTERSECTED.currentColor = new THREE.Color(INTERSECTED.material.color);
      INTERSECTED.material.color.set("yellow");
    }
  } else {
    if (INTERSECTED) {
      INTERSECTED.material.color.set(INTERSECTED.currentColor);
    }

    INTERSECTED = null;
  }
}
// ...생략...
```

위 코드는 포인터방향으로 향하는 `ray` 와 겹치는 `mesh` 가 있을 때, 색을 노란색으로 변경하고, 포인터가 다른 물체를 가르키거나, 아무것도 가르키지 않을때 원래의 색으로 돌아가게끔 동작하는 코드입니다.

#### 📔 참고자료

[광선 투사](https://ko.wikipedia.org/wiki/%EA%B4%91%EC%84%A0_%ED%88%AC%EC%82%AC)
[Raycaster](https://threejs.org/docs/?q=raycaster#api/en/core/Raycaster)
