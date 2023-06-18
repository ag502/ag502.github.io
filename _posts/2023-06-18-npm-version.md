---
title: npm 패키지 버전
date: 2023-06-18
categories: [JavaScript]
tags: [JavaScript, npm]
---

`npm` 패키지들의 버전은 `package.json` 파일에서 `dependencies` 나 `devDependencies` 프로퍼티 하위의 객체로 관리되고 있습니다. 이 패키지들의 버전 표현 방식과 특정 버전을 설치할 수 있는 방법을 알아보겠습니다.

## 💻 Semantic Version Convention

`npm` 패키지의 버전은 `semver (semantic versioner for npm)`의 컨벤션을 따르며 아래와 같이 표현됩니다.

> [Major].[Minor].[Patch]

- Major

  이전 버전과 호환되지않는 큰 변경사항이 반영된 업데이트일 경우 해당 부분의 숫자가 증가하게 됩니다.

- Minor

  이전 버전과 호환되는 가정하에, 새로운 기능이 추가되는 업데이트일 경우 해당 부분의 숫자가 증가하게 됩니다.

- Patch

  기존의 버그를 수정하기 위한 업데이트일 경우에 해당 부분의 숫자가 증가하며, 이전 버전과 호환됩니다.

## 💻 Hyphen Ranges
