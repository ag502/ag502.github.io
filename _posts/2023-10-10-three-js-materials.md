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

### 👨‍💻 MeshNormalMaterial

`MeshNormalMaterial` 는 `geometry` 의 법선(`normal`)을 보여줍니다.  
여기서 법선이란, 특정 삼각형이나 픽셀들이 향하는 방향을 의미하며 `x` 축은 빨강, `y` 축은 초록, `z` 축은 파랑색으로 표현합니다. 이 때 법선의 방향은 `camera` 에 상대적입니다. 즉 법선 벡터의 방향이 `camera` 시각에서 어디를 향하고 있는지에 따라 달라진다는 의미입니다.
`MeshNormalMaterial` 은 보통 법선 벡터를 디버깅하기 위해 많이 사용합니다.

```javascript
// ...생략...
const material = new THREE.MeshNormalMaterial();
// ...생략...
```

![normal-material-1](/assets/img/three-js-materials/normal-material-1.png)

각 정점들의 법선 벡터들이 가리키는 방향에 따라 색상이 표현되며, 이 색상들이 섞여 위와 같은 결과가 나옵니다.

#### 🖊 `flatShading`

`true` 로 설정할 경우 `flat shading` 으로 면을 렌러링하게 됩니다.

```javascript
// ...생략...
material.flatShading = true;
// ...생략...
```

`true` 로 설정할 경우, 하나의 면이나 삼각형의 정점들은 모두 같은 법선 벡터를 가지게 되고 이는 면을 평평하게 만드는 결과를 낳게됩니다.

![normal-material-2](/assets/img/three-js-materials/normal-material-2.png)

### 👨‍💻 MeshMatcapMaterial

`MeshMatcapMaterial` 은 `MatCap(Material Capture ⇔ LitSphere) texture` 에 의해 정의되는 `material` 입니다. 여기서 `MatCap texture` 란, 광원, 반사와 같은 정보를 포함하고 있는 `texture` 를 말합니다.

`MatCap texture` 를 `mesh` 에 적용하게 되면, `camera` 에 상대적인 법선 벡터의 방향에 따라 `texture` 로 부터 색을 가져오게 됩니다.
또한 `texture` 에 광원과 반사에 대한 정보가 있기때문에, 광원을 따로 추가해주지 않아도 광원에 비친것 같은 효과를 줍니다. 이는 실제 광원을 추가한 것 보다 성능상의 이점이 있습니다.  
하지만, 실제로 광원을 추가한 것은 아니기 때문에, `camera` 의 방향과 무관하게 항상 광원에 의한 효과가 항상 같다는 단점이 있습니다.

아래는 `MatCap texture` 와 이를 적용한 `mesh` 의 이미지입니다.

![matcap-texture-box](/assets/img/three-js-materials/matcap-texture-box.png)  
광원을 추가하지 않았는데, 광원을 비춘 효과가 적용된 것을 볼 수 있습니다.

#### 🖊 `map`

`MatCap texture` 를 지정하는 속성입니다.

```javascript
// ...생략...
const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;
// ...생략...
```

### 👨‍💻 MeshDepthMaterial

`MeshDepthMaterial` 은 각 픽셀의 깊이(depth)를 렌더링합니다.  
`camera` 에 가까울수록, 흰색으로 렌더링되며 멀어질수록 검은색으로 렌더링됩니다.

```javascript
// ...생략...
const material = new THREE.MeshDepthMaterial();
// ...생략...
```

아래는 `MeshDepthMaterial` 을 적용한 결과입니다.

![depth-material-box-1](/assets/img/three-js-materials/depth-material-box-1.png)

### 👨‍💻 MeshLambertMaterial

`MeshLambertMaterial` 은 광원에 반응하는 `material` 로 광택이나 반사점(specular highlights - 물체가 조명을 받을 때, 나타나는 밝은 점)이 없는 물체를 표현할 때 사용됩니다.  
`MeshLambertMaterial` 은 반사율을 계산하기 위해 비물리적 기반의 램버시안 모델(non-physically based Lambertian model)을 사용하는데,
이는 가공되지 않은 나무나 돌과 같은 표면은 표현할 수 있지만, 광택이 나는 표면은 표현하지 못합니다. 또한 해당 `material` 은 정점에서만 광원을 계산합니다.

이런 특징들 때문에 `MeshLambertMaterial` 은 광원에 반응하는 다른 `material` 들 보다 성능면에서 뛰어납니다.

```javascript
// ...생략...
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

const material = new MeshLamberMaterial();
// ...생략...
```

위 코드는 `MeshLambertMaterial` 을 생성하는 코드입니다.  
`MeshLambertMaterial` 이 광원에 반응하는 `material` 이기 때문에, 위와 같이 광원을 추가해 주어야 사용할 수 있습니다.

아래는 위 코드를 실행시킨 결과로, 조명에 의해 생긴 반사점이나 광택을 관찰할 수 없습니다.

![lambert-material-1](/assets/img/three-js-materials/lambert-material-1.png)

### 👨‍💻 MeshPhongMaterial

광원에 반응하는 `material` 로, 광택이나 반사점을 표현해야 할 때 사용합니다.  
`MeshPhongMaterial` 은 반사율을 계산하기 위해 비물리적 기반의 `Blinn-Phong` 모델을 사용합니다. 이 모델은 램버시안 모델과 달리, 광택이 나는 표면을 표현할 수 있습니다.
또한 모든 픽셀에서 광원을 계산합니다.

#### 🖊 `shininess`

반사점(Specular highlights)이 얼마나 빛날지를 결정하는 속성입니다.  
높을수록 더욱 빛나게되며, 기본값은 30 입니다.

```javascript
// ...생략...
const material = new THREE.MeshPhongMaterial();
material.shininess = 100;
// ...생략...
```

![lambert-material-sphere-1](/assets/img/three-js-materials/lambert-material-sphere-1.png)

위 이미지는 각각 `shininess` 속성을 20, 100으로 설정한 결과 입니다. 100으로 설정한 경우가 반사점이 더 빛나는 것을 볼 수 있습니다.

#### 🖊 `specular`

반사점의 색을 지정하는 설정입니다. 기본값은 `0x111111` 입니다.

```javascript
// ...생략...
const material = new THREE.MeshPhongMaterial();
material.shininess = 100;
material.specular = new THREE.Color("green");
// ...생략...
```

위 코드를 실행시킨 결과는 아래와 같습니다.

![lambert-material-sphere-2](/assets/img/three-js-materials/lambert-material-sphere-2.png)

### 👨‍💻 MeshToonMaterial

`MeshToonMaterial` 은 그라디언트 맵을 사용하는 `material` 입니다.  
투톤의 그라디언트가 기본으로 지정되어 있어 카툰의 느낌을 줍니다. 그라디언트는 직접 설정해 줄 수도 있습니다.

```javascript
// ...생략...
const material = new THREE.MeshToonMaterial();
// ...생략...
```

![toon-material-sphere-1](/assets/img/three-js-materials/toon-material-sphere-1.png)

위 이미지는 기본 그라디언트가 적용된 `MeshToonMaterial` 입니다.

#### 🖊 `gradientMap`

`MeshToonMaterial` 의 그라디언트를 지정해 줄 수 있는 속성입니다.  
`gradientMap` 을 지정해줄 때 주의할 점은, `magFilter` 와 `minFilter` 를 `THREE.NearestFilter` 로 지정해 주어야 한다는 것입니다.

```javascript
// ...생략...
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const material = new MeshToonMaterial();
material.gradientMap = gradientTexture;
// ...생략...
```

### 👨‍💻 MeshStandardMaterial

`PBR` (Physically Based Rendering) 을 기반으로 한 `material` 로, 앞서 살펴본 `material` 들과 달리 조명과 상호작용하는 방식을 훨씬 더 정확하게 표현합니다 (현실 세계와 거의 비슷하게 표현).

#### 🖊 `roughness`

`Material` 의 거칠기(roughness)를 표현하는 속성입니다.  
`0.0` 일 경우 표면이 매끄러워져 거울처럼 반사가 일어나며, `1.0` 일 경우 표면이 상대적으로 거칠어져 반사가 발생하지 않습니다 (fully diffuse). 기본값은 `1.0` 입니다.

```javascript
// ...생략...
const material = new THREE.MeshStandardMaterial();
material.map = colorTexture;
material.roughness = 0;
// ...생략...
```

![standard-material-roughness-1](/assets/img/three-js-materials/standard-material-roughness-1.png)

위 결과에서 `roughness` 가 0 인것이 1 보다 표면이 매끄러운것을 알 수 있으며, 반사점도 생겼음을 볼 수 있습니다.

#### 🖊 `metalness`

`Material` 의 금속성(metalness)을 표현하는 속성입니다.  
금속성을 띄지 않는 `material` 은 `0.0` 이며, 금속성을 띄는 `material` 은 `1.0` 값을 가집니다. 기본값은 `0.0` 입니다.

![standard-material-metalness-1](/assets/img/three-js-materials/standard-material-metalness-1.png)

#### 🖊 `roughnessMap`

`Rough texture` 를 설정할 수 있는 속성입니다.  
만약 해당 속성에 값이 설정되었다면, `roughness` 속성은 기본값으로 설정해야 합니다. 그렇지 않으면 값이 배가 됩니다.

```javascript
// ...생략...
const material = new THREE.MeshStandardMaterial();
material.roughnessMap = roughnessTexture;
// ...생략...
```

#### 🖊 `metalnessMap`

`Metalness texture` 를 설정할 수 있는 속성입니다.  
`roughnessMap` 과 마찬가지로, 해당 속성이 설정되었다면 `metalness` 속성을 기본값으로 설정해야합니다.

```javascript
// ...생략...
const material = new THREE.MeshStandardMaterial();
material.metalnessMap = metalnessTexture;
// ...생략...
```

#### 🖊 `aoMap`

`Ambient Occlusion texture` 를 적용할 수 있는 속성으로, `texture` 에서 어두운 부분에 그림자를 추가합니다.

```javascript
// ...생략...
const material = new THREE.MeshStandardMaterial();
material.aoMap = ambientOcclusionTexture;
// ...생략...
```

![standard-material-aomap-1](/assets/img/three-js-materials/standard-material-aomap-1.png)

위 그림은 `Ambient Occlusion texture` 를 적용하기 전과 후의 이미지 입니다.  
적용하기 전과 비교했을 때, `texture` 의 어두운 부분에 해당하는 부분이 `mesh` 에서 더 어두워 졌음을 볼 수 있습니다.

#### 🖊 `aoMapIntensity`

`aoMap` 에서 음영효과를 얼마나 줄것인지 설정할 수 있는 속성입니다.  
기본값은 `1` 이며, `0` 으로 설정할 시 효과적용이 되지 않습니다.

#### 🖊 `displacementMap`

`Displacement Texture` 를 설정하는 속성입니다.

```javascript
// ...생략...
const material = new THREE.MeshStandardMaterial();
material.displacementMap = displacementTexture;
// ...생략...
```

![standard-material-displacement-1](/assets/img/three-js-materials/standard-material-displacement-1.png)

위 이미지는 왼쪽의 `Displacement texture` 를 오른쪽의 `SphereGeometry` 에 적용한 결과입니다.  
`Displacement texture` 와 실제 적용된 결과가 다른 것을 볼 수 있는데, 이는 `displacement texture` 의 특징때문에 그렇습니다.
[`texture`](https://ag502.github.io/posts/three-js-textures/#-height-displacement) 에서 살펴보았듯이, 해당 `texture` 는 `geometry` 의 면들을 나누에 해당 정점들을 높이에 따라 변경합니다. 따라서 `segment` 가 높을 수로 정교해집니다.

아래는 `new THREE.SphereGeometry(1, 1000, 1000)` 로 `segment` 를 증가시킨 후 적용시킨 결과입니다.

![standard-material-displacement-2](/assets/img/three-js-materials/standard-material-displacement-2.png)

#### 🖊 `displacementScale`

`displacementMap` 이 `mesh` 에 영향을 끼치는 정도를 지정하는 옵션입니다.  
기본값은 `1` 이며, `0` 으로 설정시 효과가 적용되지 않습니다.

![standard-material-displacement-3](/assets/img/three-js-materials/standard-material-displacement-3.png)

#### 🖊 `normalMap`

`Normal Texture` 를 적용하는 속성입니다.

#### 🖊 `alphaMap`

`Opacity texture` 를 설정할 수 있는 옵션입니다.

### 👨‍💻 MeshPhysicalMaterial

`MeshPhysicalMaterial` 은 `MeshStandardMaterial` 과 기본적으로 같지만, `clearcoat` 옵션으로 표면의 코팅 세기를 설정하고 `clearcoatRoughness` 로 코팅의 거칠기를 설정한다는 점이 다릅니다.

### 👨‍💻 PointsMaterial

`Points` 가 기본으로 사용하는 `material` 입니다.

### 👨‍💻 ShaderMaterial, RawShaderMaterial

`Material` 을 커스텀할 때 사용합니다.  
`ShaderMaterial` 의 경우 `three.js` 의 `shader` 시스템을 사용하지만, `RawShaderMaterial` 의 경우 그렇지 않다는 차이점이 있습니다.

#### 📔 참고자료

[metal key hole 001](https://3dtextures.me/2021/12/29/metal-key-hole-001/)  
[matcaps](https://github.com/nidorx/matcaps)  
[Materials](https://threejs.org/manual/#en/materials)
