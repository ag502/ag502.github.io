---
title: first-child/last-child vs first-of-type/last-of-type
date: 2023-08-14
categories: [CSS]
tags: [CSS, pseudo-classes]
image:
  path: /assets/img/css-main.png
  alt: css logo
---

`pseudo-class`는 `selector`옆에 콜론(:)과 함께 추가되며 주로 선택된 요소의 상태에 따른 스타일을 지정하기 위해 사용됩니다.  
이글에서는 `pseudo-class`의 여러 종류중 `first-child`/`last-child`를 알아보고 그와 비슷한 `first-of-type`/`last-of-type`과의 차이점을 살펴보겠습니다.

## 💻 first-child/last-child

`first-child`는 `selector`의 부모에서 가장 첫번째 요소(자식)을 의미합니다. 아래의 예시를 통해 살펴보겠습니다.

```html
<head>
  <style>
    p:first-child {
      color: blue;
    }
  </style>
</head>

<body>
  <section>
    <p>Section p1</p>
    <p>Section p2</p>
    <p>Section p3</p>
  </section>

  <p>main p1</p>
</body>
```

위 `html`에 `CSS`를 적용한 결과는 다음과 같습니다.

![first-child](/assets/img/first-child-vs-first-of-type/first-child.png)

`Section p1` 텍스트를 포함하고 있는 `p` 태그는 부모요소인 `section` 태그에 대해 첫번째 자식 요소이기 때문에 `color: blue;`선언(declaration)이 적용되었습니다. 반면, `main p1` 텍스트를 포함하고 있는 `p` 태그는 부모요소인 `body` 태그에 대해 마지막 자식입니다. 따라서 `:first-child`를 만족하지 않아 적용되지 않았습니다.

만약 위 `html`코드에 `:first-child`를 `:last-child`로 변경시킬 경우는, `section`태그의 자식중 마지막 `p` 태그와 `main p1` 텍스트를 포함하고 있는 `p` 태그에 스타일이 적용됩니다.

![last-child](/assets/img/first-child-vs-first-of-type/last-child.png)

## 💻 first-type-of/last-type-of

`first-type-of`은 `first-child`와 유사하지만 순서를 비교하는 대상에서 차이점이 있습니다.  
`first-child`는 `pseudo-class`가 적용된 `selector`의 모든 형제(sibling)들과 비교하지만, `first-of-type`은 `selector`의 형제 요소들 중, 같은 유형들 끼리만 비교합니다.

```html
<head>
  <style>
    p:first-of-type {
      color: blue;
    }
  </style>
</head>

<body>
  <section>
    <p>Section p1</p>
    <p>Section p2</p>
    <p>Section p3</p>
  </section>

  <p>main p1</p>
</body>
```

위 코드의 결과는 다음과 같습니다.

![first-of-type](/assets/img/first-child-vs-first-of-type/first-of-type.png)

`:first-child`와 비교했을 때, `main p1` 텍스트를 가진 `p` 태그에 스타일이 적용되었음을 알 수 있습니다. 해당 `p` 태그는 `p` 태그를 가진 `body` 태그의 자식요소들 중에서 첫번째 요소이기 때문입니다.
