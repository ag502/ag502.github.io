---
title: three.js 외부 모델 불러오기
date: 2023-10-28
categories: [three.js, WebGL]
tags: [three.js]
image:
  path: /assets/img/three-js-main.png
  alt: three-js-logo
---

`Primitive Geometry` 를 이용하여 만들기 어려운 모델들은 3D 에디터를 활용하여 만든 후, 임포트해야 합니다.  
이 글에서는 모델의 형식 및 특징과 모델을 불러오는 방법을 살펴보겠습니다.

## 💻 형식(확장자)

3D 모델의 확장자의 종류는 다양합니다. 여러종류의 포멧들을 몇가지 기준으로 분류하면 다음과 같습니다.

- 3D 에디터 형식  
  3D 에디터에서 사용하는 파일 형식으로, `.blend` (블렌더), `.max` (3D Studio Max), `mb`, `ma` 등이 있습니다.

- 교환 형식 (Exchange Formats)  
  3D 에디터끼리 데이터를 교환하기 위한 형식으로, `.OBJ`, `DAE` (Collada), `.FBX` 등이 여기에 속합니다.  
  보통 에디터 내부에서 사용되는 데이터보다 많은 정보를 담고 있습니다.

- 앱 형식  
  특정 앱이나 게임 등에서 사용하는 파일 형식 입니다.

- 전달 형식 (Transmission Formats)  
  3D 모델의 정보를 효율적으로 공유하고, 전송하기 위한 형식으로, `.gltf` 가 여기에 포함됩니다.

## 💻 GLTF

`GLTF` 는 GL Transmission Format 의 약자로, `openGL` 을 만든곳에서 만든 형식입니다.  
`GLTF` 는 `geometry`, `material`, `camera`, `light`, `animation` 등과 같이 모델의 정보를 나타내는 많은 정보들을 포함하고 있습니다. 또한 별도의 처리과정 없이 모델을 바로 GPU에 로드할 수 있으며, 렌더링에 최적화되어 있습니다.

추가로, `GLTF` 형식내에서도, `Binary`, `Draco`, `Embedded` 와 같은 하위 형식이 존재하며, 각각 다른 특징들을 가지고 있습니다.

- `glTF` (`.gltf`)  
  `GLTF` 의 기본 형식으로 `JSON` 으로 되어있습니다.  
  해당 파일에는 `scene`, `camera`, `light`, `materials`, `objects` 등에 관련된 정보는 있지만, `geometry` 나 `texture` 에 대한 정보는 없습니다. 이런 이유 때문에, 기본 `glTF` 형식은 `.bin` 파일 및 이미지 파일과 함께 생성됩니다.  
  `.bin` 파일은 이진 파일로, `geometry` 전반에 관련된 정보를 가지고 있으며, 이미지 파일은 `texture` 에 대한 정보를 가지고 있습니다.

  `glTF` 파일의 `buffers`, `images` 속성에 `.bin` 파일과, 이미지 파일에 대한 경로가 있어, `.gltf` 파일 하나만 로드하면 `.bin` 파일과 이미지 파일은 자동으로 로드가 됩니다.

- `glTF-Binary` (`.glb`)  
  모델에 대한 모든 정보가 이진코드로 된 하나의 파일에 존재하는 형식입니다.  
  다른 형식들에 비해 가볍고, 로드가 빠르다는 장점이 있지만, 이진화 되어있어 수정이 어렵다는 점이 단점입니다.

- `glTF-Draco` (`.gltf`)  
  `buffer` 정보를 `Draco` 알고리즘을 이용해 압축시킨 형식입니다.  
  `GLTF` 의 기본 형식과 마찬가지로 `.bin` 파일과 이미지 파일이 필요하지만, `buffer` 정보가 압축되었기 때문에 `.bin` 파일의 용량이 작습니다.

- `glTF-Embedded` (`.gltf`)  
  `.gltf` 확장자의 `JSON` 파일 하나만 갖고 있는 형식입니다.  
  `.bin` 파일과 이미지 파일이 `Data URL` 형식으로 `.gltf` 파일에 임베딩되어있습니다.

## 💻 GLTF 불러오기

`GLTF` 파일을 불러오기 위해서는 `GLTFLoader` 를 사용해야 합니다.

```javascript
// ...생략...
import { GLTFLoader } from "three/addons/loaders/GLTFLoaders";

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "gltf-file-path",
  (gltf) => {
    console.log("model is loaded");
  },
  (xmlHttpRequest) => {
    console.log("model is loading");
  },
  (error) => {
    console.log("model cannot be loaded");
  }
);
// ...생략...
```

`GLTFLoader` 는 `three/addons` 경로(three/examples/jsm) 에 위치하고 있으며, `onLoad`, `onProgress`, `onError` 를 인자로 받습니다. 추가로 `GLTFLoader` 는 앞서 살펴본 `Loader` 들과 마찬가지로 `Loader` 클래스를 상속받기 때문에 `LoadingManager` 를 생성자의 인자로 넣어줄 수 있습니다.

## 💻 GLTF 모델 Scene에 추가하기

`GLTF` 모델을 불러온 후, 콘솔에 출력하면 아래와 같이 출격됩니다.

![gltf-console](/assets/img/three-js-load-models/gltf-console.png)

위에서 출력된 객체의 속성들중, 모델을 `scene` 에 추가하기 위해 사용할 속성은 `scene` 와 `scenes` 입니다.  
`scene` 속성은 모델의 `scene graph` 를 나타내며, `scenes` 는 사용된 `scene graph` 의 배열입니다. `GLTF` 의 `scene` 들을 추가해주면 화면에 출력할 수 있습니다.

```javascript
// ...생략...
const gltfLoader = new GLTFLoader();
gltfLoader.load("gltf-file-path", (gltf) => {
  const root = gltf.scene;
  scene.add(root);
});
// ...생략...
```

위 코드를 실행한 결과는 다음과 같습니다.

![gltf-loaded-model-1](/assets/img/three-js-load-models/gltf-loaded-model-1.png)

#### 🖊 Scene Graph 출력해보기

> 아래의 함수를 이용하여 `GLTF` 의 `scene graph` 를 출력해보겠습니다.
>
> ```javascript
> function dumpObj(obj, lines = [], isLast = true, prefix = "") {
>   const localPrefix = isLast ? "└─" : "├─";
>   lines.push(
>     `${prefix}${prefix ? localPrefix : ""}${obj.name || "*no-name*"} [${
>       obj.type
>     }]`
>   );
>   const newPrefix = prefix + (isLast ? " " : "⎸ ");
>   const lastNdx = obj.children.length - 1;
>   obj.children.forEach((child, ndx) => {
>     const isLast = ndx === lastNdx;
>     dumpObj(child, lines, isLast, newPrefix);
>   });
>   return lines;
> }
> ```
>
> 위 함수를 이용해 `scene  graph` 를 출력하면 다음과 같이 나옵니다.
> ![gltf-scene-graph](/assets/img/three-js-load-models/gltf-scene-graph.png)

## 💻 glTF-Draco 모델 불러오기

`glTF-Draco` 형식을 불러오기 위해서는, `DRACOLoader` 가 필요합니다.

```javascript
// ...생략...
import { DRACOLoader } from "three/addons/loaders/DRACOLoader";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");

gltfLoader.setDRACOLoader(dracoLoader);
// ...생략...
```

`DRACOLoader` 는 `GLTFLoader` 와 마찬가지로 `addons` 에서 임포트 합니다.  
먼저 `setDecoderPath` 함수에 `JavaScript` 나 `WASM` 로 된 알고리즘의 경로를 넘겨주어, 사용할 `decoder` 라이브러리를 지정해야 합니다.
`three.js` 에는 `/node_modules/three/examples/jsm/libs/draco/` 경로에 제공하는 라이브러리가 있습니다.

`Draco` 알고리즘을 사용하면 압축된 `geometry` 를 사용하기때문에 로드가 빠르지만, 초기에 `glTF-Draco` 파일을 `decode` 하는데 시간이 걸립니다. 따라서, 용량이 적은 파일을 로드할때는 사용하지 않는것이 나을때도 있습니다.

## 💻 애니메이션 추가하기

로드한 `GLTF` 모델의 애니메이션을 추가하기 위해서는, `animations` 속성을 이용해야 합니다.  
`animations` 에는 `AnimationClip` 들의 배열이며, `AnimationClip` 은 `keyframe` 과 비슷한 역할을 합니다.

`AnimationClip` 을 재생하려면, `AnimationMixer` 를 이용해야 합니다.

```javascript
// ...생략...
let mixer = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load("gltf-file-path", (gltf) => {
  const root = gltf.scene;
  scene.add(root);

  mixer = new THREE.AnimationMixer(root);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();
});

let previousTime = 0;

const animation = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  mixer && mixer.update(deltaTime);

  // ...생략...
};

requestAnimationFrame(animation);
// ...생략...
```

`AnimationMixer` 의 `clipAction` 에 `ActionClip` 을 넘겨준 후, `play` 함수를 실행해 애니메이션을 동작시킬 수 있습니다.
추가로 랜더링 함수에 `update` 함수를 매 프레임마다 실행시켜 주어야 합니다.

결과는 아래와 같습니다.

![gltf-loaded-model-animation](/assets/img/three-js-load-models/gltf-loaded-model-animation.gif)

#### 📔 참고자료

[Loading a .GLTF File](https://threejs.org/manual/#en/load-gltf)  
[GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)  
[DRACOLoader](https://threejs.org/docs/?q=DracoLoader#examples/en/loaders/DRACOLoader)  
[AnimationMixer](https://threejs.org/docs/#api/en/animation/AnimationMixer)  
[AnimationClip](https://threejs.org/docs/#api/en/animation/AnimationClip)
