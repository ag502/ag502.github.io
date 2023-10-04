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
회색조(gray scale)을 띄며, 해당 `texture` 가 적용되는 `mesh` 의 면들을 잘게나누어 해당 정점들을 변경하는 특성이 있습니다.
`texture` 의 검은색 부분은 정점을 아래로 이동시키며, 흰색 부분은 위로 이동시킵니다. 회색을 띄는 부분은 두색 사이의 지점을 의미합니다.  
`Height` 의 장점은 세부적인 표현이 가능한 것이지만, 성능상의 문제가 발생할 수 있습니다.

### 👨‍💻 Normal

`Normal` 은 `Height` 와 마찬가지로 높낮이를 표현하기 위해 사용한다는 점이 비슷하지만 방식이 다릅니다.  
`Normal` 은 `mesh` 의 정점들을 변경하지 않고, 빛이 표면과 상호작용하는 방식을 가짜로 만들어 높낮이를 표현합니다. 또한 연한 보라색을 띄고 있으며, `rgb` 값들은 높낮이나, 틈을 나타냅니다.

### 👨‍💻 Ambient Occlusion

`Mesh` 가 빛에 얼마나 노출되는지를 표현하기 위해 사용되는 `texture` 입니다.  
회색조를 띄며, 밝은 부분은 빛을 흡수하는 부분이고 어두운 부분은 빛에 덜 반응하는 부분을 나타냅니다.

### 👨‍💻 Metalness

금속성과, 금속의 반사를 표현하기 위해 사용되는 `texture` 입니다.  
회색조의 이미지이며, 흰색 부분은 금속성을 띄는 부분을, 검은색 부분은 금속성을 띄지 않는 부분을 의미합니다.

### 👨‍💻 Roughness

거칠기를 나타내기 위해 사용되는 `texture` 입니다.  
회색조이며, 흰색은 최대 거칠기를, 검은색은 최소 거칠기를 의미합니다.

#### 📔 참고자료

[How to make photorealistic 3D graphics with different texture maps?](https://www.webdew.com/blog/how-to-make-photorealistic-3d-graphics)  
[A Brief Introduction to Texture mapping for 3D Artists](https://professional3dservices.com/blog/texture-mapping-guide.html)  
[Texture Maps: The Ultimate Guide For 3D Artists](https://conceptartempire.com/texture-maps/)
