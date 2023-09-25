---
title: WebGL과 three.js의 기본요소
date: 2023-09-23
categories: [three.js, WebGL]
tags: [TypeScript]
image:
  path: /assets/img/three-js-main.png
  alt: three-js-logo
---

## 💻 WebGL 이란?

`WebGL` (Web Graphics Library)은 `OpenGL` 에 기반한 웹 표준 API로, 해당 API를 사용하여 `canvas` 에 2D 나 3D 그래픽을 렌더링할 수 있습니다.  
`WebGL` 을 사용한 코드는 GPU 상에서 병렬적으로 처리되어 성능면에서 뛰어나다는 장점이 있습니다.

## 💻 Render Pipeline

![geeks-for-geeks](/assets/img/webgl-three-js-four-elements/render-pipeline.png)

`WebGL` 이 그래픽을 렌더링할 때는 위의 단계를 거칩니다.

1. Vertex Shader  
   GPU가 점(`vertex`)들의 위치를 병렬적으로 계산해 올바른 곳에 위치시킵니다

2. Primitives Generation(Primitive Assembly)  
   `Vertex` 들을 연결해 삼각형들의 집합으로 만듭니다.

3. Rasterization  
   만들어진 삼각형 집합을 픽셀로 변형시킵니다.

4. Fragment Shader  
   픽셀을 지정한 색과 질감등으로 채웁니다.

`Vertex` 들을 위치 시키고, 픽셀에 색을 채우는 것과 같은 작업은 `shader` (`vertex shader`, `fragment shader`) 단계에서 일어나는데, 이 단계는 코드로 제어할 수 있습니다.

`Primitives Generation` 단계에 알 수 있듯이, `WebGL` 을 이용하여 렌더링하는 물체들은 모두 삼각형들로 구성 되어있습니다. 삼각형을 렌더링에 사용하는 이유는 기하학적인 단순성및 계산의 효율성등의 이유가 있습니다.

## 💻 three.js 의 네가지 기본요소

### 👨‍💻 Scene

### 👨‍💻 Mesh

### 👨‍💻 Camera

### 👨‍💻 Renderer

#### 📔 참고자료

[WebGL Introduction](https://www.geeksforgeeks.org/webgl-introduction/)  
[Rendering Pipeline Overview](https://www.khronos.org/opengl/wiki/Rendering_Pipeline_Overview)
