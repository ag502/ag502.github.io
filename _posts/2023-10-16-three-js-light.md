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

`HemisphereLight` 는 `AmbientLight` 와 비슷하게 방향이 존재하지 않지만, 위와 아래에서 비추는 조명의 색이 다른다는 차이점이 있습니다.]
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

## 💻 PointLight

## 💻 SpotLight

## 💻 ReactAreaLight

#### 📗 참고자료

[Lights](https://threejs.org/manual/#en/lights)
