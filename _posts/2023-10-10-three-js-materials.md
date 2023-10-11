---
title: three.js material 살펴보기
date: 2023-10-10
categories: [three.js, WebGL]
tags: [three.js]
image:
  path: /assets/img/three-js-main.png
  alt: three-js-logo
---

## 💻 material 이란?

`Material` 은 물체의 시각적 특성(색상, 광택, 반사, 불투명도 등)을 결정짓는 역할을 합니다.

## 💻 material 의 종류

`three.js` 에는 여러종류의 `material` 이 있으며, 각각의 `material` 들은 `Material` 클래스를 상속받습니다. 따라서 `material` 끼리 공통된 속성이 존재합니다.

`Material` 의 속성을 지정할때의 방법은 두가지 있습니다. 첫번째는 생성자에 속성값을 넘겨주는 방법이고,

```javascript
// ...생략...
const material = new MeshBasicMaterial({ map: texture, color: "red" });
// ...생략...
```

두번째는 `setter` 를 통해 `material` 생성 후에 바꾸는 것입니다.

```javascript
// ...생략...
const material = new MeshBasicMaterial();
material.map = texture;
material.color.set("red");
// ...생략...
```

한가지 주의할 점은 `setter` 를 통해 색을 변경할 경우, 단순 할당이 아닌 메소드를 사용했다는 점입니다.
이는 `color` 속성이 `THREE.Color` 형식이기때문에 문자열등을 할당할 수 없기 때문입니다.

### 👨‍💻 MeshBasicMaterial

`MeshBasicMaterial` 은 가장 단순하고 간단한 방식으로 물체의 외형을 결정하는 `material` 입니다.  
`MeshBasicMaterial` 의 몇가지 속성들은 다음과 같습니다.

#### 🖊 `map`

`map` 속성은 `geometry` 의 `texture` 를 설정해주는 옵션입니다.

```javascript
// ...생략...
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("image-path");

const planeGeometry = new THREE.PlaneGeometry(1, 1);

const material = new THREE.MeshBasicMaterial();
material.map = texture;

const mesh = new THREE.Mesh(planeGeometry, material);

// ...생략...
```

위 코드는 `MeshBasicMaterial` 에 `texture` 를 적용한 후, `PlaneGeometry` 표면에 입힌 코드입니다.  
`texture` 를 `Albedo` 로 설정한 후 실행해보면 아래와 같은 결과가 나옵니다.

![color-texture-plane](/assets/img/three-js-materials/color-texture-plane.png)

#### 🖊 `color`

`Material` 의 색상을 설정하는 옵션이며 `MeshBasicMaterial` 의 기본 색상은 흰색입니다.

```javascript
// ...생략...
const material = new THREE.MeshBasicMaterial();
material.color.set("red");
material.color = new THREE.Color("blue");
// ...생략...
```

#### 🖊 `wireframe`

`Wireframe` 렌더링 여부를 결정하는 속성입니다.

```javascript
// ...생략...
material.wireframe = true;
// ...생략...
```

#### 🖊 `opacity`

투명도를 결정하는 속성으로 `0.0` ~ `1.0` 사이의 값을 가지며, `0.0` 에 근사한 값일수록 투명해집니다.  
한가지 주의할 점은 `transparent` 속성을 `true` 로 설정하지 않으면 해당 값이 적용되지 않습니다.

```javascript
// ...생략...
const material = new THREE.MeshBasicMaterial();
material.color.set("yellow");
material.transparent = true;
material.opacity = 0.5;
// ...생략...
```

아래는 위 코드를 적용한 결과입니다. `PlaneGeometry` 에 투명도가 적용되어, 뒤에 있는 `BoxGeometry` 가 보이는것을 알 수 있습니다.

![basic-material-opacity-1](/assets/img/three-js-materials/basic-material-opacity-1.png)

#### 🖊 `alphaMap`

`Opacity texture` 를 설정할 수 있는 옵션입니다.  
해당 옵션을 사용하려면, `opacity` 옵션과 마찬가지로 `transparent` 를 `true` 설정해 주어야 합니다.

```javascript
// ...생략...
const albedoTexture = textureLoader.load("image-path");
const opacityTexture = textureLoader.load("image-path");

const material = new THREE.MeshBasicMaterial();
material.transparent = true;
material.map = albedoTexture;
material.alphaMap = opacityTexture;
// ...생략...
```

![opacity-texture-plane](/assets/img/three-js-materials/opacity-texture-plane.png)

[`texture`](https://ag502.github.io/posts/three-js-textures/#-opacity-transparency) 에서 살펴보았듯이 `opacity texture` 의 흰색은 보이는 부분을 검은색은 보이지 않는 부분을 의미합니다.
따라서 위 이미지의 제일 왼쪽의 `opacity texture` 를 `PlaneGeometry` 에 적용하게되면 검은색 부분은 보이지 않음을 알 수 있습니다(가운데 사진). 또한 `albedo texture` 와 함께 적용해도 가장자리의 검은색 부분은 투명하게 처리됩니다(오른쪽 사진).

#### 🖊 `side`

어느 면을 렌더링 할 지를 결정하는 옵션입니다.  
`THREE.FrontSide`, `THREE.BaskSide`, `THREE.DoubleSide` 세개의 값을 설정할 수 있으며, 각각 `mesh` 의 앞면, 뒷면, 양면에 `material` 이 적용됩니다. 기본값은 `THREE.FrontSide` 입니다.  
주의할 점은 `THREE.DoubleSide` 일 경우 면에 그려지는 삼각형이 두배가 된다는 것입니다.

#### 📔 참고자료

[metal key hole 001](https://3dtextures.me/2021/12/29/metal-key-hole-001/)
