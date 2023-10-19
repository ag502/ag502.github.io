---
title: three.js light 살펴보기
date: 2023-10-16
categories: [three.js, WebGL]
tags: [three.js]
image:
  path: /assets/img/three-js-main.png
  alt: three-js-logo
---

`three.js` 사용하는 `light` 는 `Object3D` 를 상속받은 `Light` 클래스를 상속받습니다.  
`Light` 의 종류와 특징을 살펴보겠습니다.

## 💻 AmbientLight

> <span style="color: cyan;">AmbientLight(color: Integer, intensity: Float)</span>

`AmbientLight` 는 `scene` 안에 있는 모든 `mesh` 들 에게 균일하게 적용된다는 특징이 있습니다. 즉 방향이 존재하지 않아(omnidirectional) 모든 물체들이 균일하게 조명을 받습니다.

![ambient-light-2](/assets/img/three-js-light/ambient-light-2.png)

```javascript
// ...생략...
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
// ...생략...
```

위 예시는, `intensity` 가 `1` 이며, 색이 흰색인 `AmbientLight` 를 추가하는 코드입니다. 여기서 `intensity` 는 조명의 강도를 의미합니다.

위 코드를 실행시킨 결과는 아래와 같습니다.

![ambient-light-1](/assets/img/three-js-light/ambient-light-1.png)

모든 `mesh` 가 균일하게 조명을 받았음을 볼 수 있습니다.

`AmbientLight` 는 빛의 반사로 인해 생기는 효과를 재현하기 위해 사용할 수 있습니다. 현실 세계에서는 조명을 받지 않는 부분도 반사에 의해 희미하게 보이는데, `AmbientLight` 의 `intensity` 를 조절해 비슷한 효과를 표현할 수 있습니다.

## 💻 HemisphereLight

> <span style="color: cyan;">HemiSphereLight(skyColor: Integer, groundColor: Integer, intensity: Float)</span>

`HemisphereLight` 는 `AmbientLight` 와 비슷하게 방향이 존재하지 않지만, 위와 아래에서 비추는 조명의 색이 다른다는 차이점이 있습니다.

![hemisphere-light-1](/assets/img/three-js-light/hemisphere-light-1.png)

```javascript
// ...생략...
const skyColor = 0xb1e1ff; // 하늘색
const groundColor = 0xb97a20; // 오렌지 브라운
const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, 1);
// ...생략...
```

위 코드는, 위로부터 오는 조명의 색은 `0xb1e1ff` 로, 아래에서 오는 조명의 색은 `0xb97a20` 설정한 `HemiSphereLight` 의 예시이며, 해당 코드를 실행한 결과는 아래와 같습니다.

![hemisphere-light-2](/assets/img/three-js-light/hemisphere-light-2.png)

`scene`의 위와 아래의 색이 다른것을 확인할 수 있습니다.

## 💻 DirectionalLight

> <span style="color: cyan;">DirectionalLight( color : Integer, intensity : Float )</span>

`DirectionalLight` 는 이름에서도 알 수 있듯이, 방향이 존재하며 해당 방향으로 빛이 나아갑니다. 또한 무한히 먼 거리에서 평행하게 빛이 진행하는 것처럼 생각할 수 있습니다.
이런 특성때문에 태양을 표현할 때 주로 사용이 됩니다.

![directional-light-1](/assets/img/three-js-light/directional-light-1.png)

```javascript
// ...생략...
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionLight);
// ...생략...
```

위는 `DirectionalLight` 를 추가하기 위한 코드이며, 실행결과는 아래와 같습니다.

![directional-light-2](/assets/img/three-js-light/directional-light-2.png)

`DirectionalLight` 에는 `target` 이라는 `Object3D` 타입을 갖는 속성이 있는데, 이 속성은 빛의 진행 방향을 결정하는 역할을 합니다.
다시 말해, `DirectionalLight` 의 방향은 광원의 위치인 `position` 에서 `target` 으로의 방향이 됩니다.

`DirectionalLight` 의 `position` 초깃값은 `(0, 1, 0)` 이며, `target` 의 초기 `position` 은 `(0, 0, 0)` 이므로 빛의 진행방향은 위 이미지와 같이 위에서 아래가 됩니다.

```javascript
// ...생략...
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-10, 0, 0);

scene.add(directionalLight.target);
scene.add(directionalLight);
// ...생략...
```

위 코드는, `DirectionalLight` 의 위치와 `target` 의 위치를 이동시킨 코드입니다. 바뀐 `target` 의 위치를 적용하기 위해 `scene` 에 추가한 것을 볼 수 있습니다.

![directional-light-3](/assets/img/three-js-light/directional-light-3.png)

## 💻 PointLight

> <span style="color: cyan;">PointLight( color : Integer, intensity : Float, distance: Number, decay: Float )</span>

`PointLight` 는 빛이 한 점에서 모든 방향으로 뻗어나간다는 특징이 있습니다.  
주로 전구나 촛불과 같은 광원을 표현하기 위해 사용합니다.

![point-light-1](/assets/img/three-js-light/point-light-1.png)

```javascript
// ...생략...
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);
// ...생략...
```

위 코드는 `PointLight` 를 생성해, 광원의 위치를 `(0, 10, 0)` 으로 옮긴 코드로 결과는 아래와 같습니다.

![point-light-2](/assets/img/three-js-light/point-light-2.png)

`PointLight` 에는 지금까지 살펴본 `light` 와 달리 `distance` 와 `decay` 인자를 추가로 받습니다.

- `distance`  
  빛의 영향이 닿는 거리를 의미하며, `0` 일 경우 무한대로 퍼지며, `0` 이 아닐경우, 설정한 지점까지만 퍼져나갑니다.

  ![point-light-3](/assets/img/three-js-light/point-light-3.png)

- `decay`  
  거리에 따라 빛이 흐려지는 정도를 설정하는 옵션으로 기본값은 `2` 입니다.

## 💻 SpotLight

> <span style="color: cyan;">SpotLight( color : Integer, intensity : Float, distance: Number, angle: Radians, penumbra: Number, decay: Float )</span>

`SpotLight` 는 한 점에서부터 원뿔을 따라, 한 방향으로 나아가는 `light` 입니다.  
원뿔은 내부 원뿔과, 외부 원뿔로 이루어져 있으며, 내부 원뿔에서 밝기가 가장 세고, 외부로 갈 수록 `0`에 가까워 집니다.

![spot-light-1](/assets/img/three-js-light/spot-light-1.png)

```javascript
// ...생략...
const spotLight = new THREE.SpotLight(0xffffff, 1);
scene.add(spotLight);
scene.add(spotLight.target);
// ...생략...
```

위 코드는 `SpotLight` 를 생성하는 코드입니다.  
`SpotLight` 도 `DirectionalLight` 와 비슷하게 방향이 존재함으로 `target` 을 이용해 방향을 바꿔야 합니다. 따라서 `target` 을 `scene` 에 추가했음을 볼 수 있습니다.

`SpotLight` 는 `PointLight` 가 받는 인자외에도, `angle`, `penumbra` 두 인자를 추가로 받습니다.

- `angle`  
  `SpotLight` 의 최대 범위를 지정해주는 속성입니다.  
  단위는 `radian` 이며 기본값은 `π / 3` 이며, `π / 2` 보다 크게 설정할 수 없습니다.

  ![spot-light-2](/assets/img/three-js-light/spot-light-2.png)

- `penumbra`  
  외부 원뿔에 대한 내부 원뿔의 비율을 설정하는 속성입니다. 즉 `penumbra` 의 값이 `0` 이면 내부 원뿔과 외부 원뿔의 크기가 같음을 의미하고, `1` 이면 원뿔의 중앙에서 부터 희미해짐을 의미합니다. 만약 `0.5` 라면 중앙과 외부 원뿔의 50% 지점에서 부터 흐려지게 됩니다. 기본값은 `0` 입니다.

  ![spot-light-3](/assets/img/three-js-light/spot-light-3.png)

## 💻 ReactAreaLight

> <span style="color: cyan;">ReactAreaLight( color : Integer, intensity : Float, width: Float, height: Float )</span>

`ReactAreaLight` 는 직사각형 평면에 고르게 빛을 방출하는 `light` 입니다.  
주로 빛이 들어오는 유리창이나, 스트립 조명(strip light)를 표현할 때 사용하며, `MeshStandardMaterial` 이나 `MeshPhysicalMaterial` 만 지원하는 특징이 있습니다.

#### 📗 참고자료

[Lights](https://threejs.org/manual/#en/lights)  
[Lighting, Rendering and Presentation](https://shanereeves3d.wordpress.com/2016/03/13/lighting-rendering-and-presentation/)
