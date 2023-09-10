---
title: Typescript Module Resolution
date: 2023-09-09
categories: [TypeScript]
tags: [TypeScript]
image:
  path: /assets/img/ts-main.png
  alt: typescript logo
---

## 💻 Module Resolution 이란?

`Module Resolution` (모듈 해석)은 `TypeScript` 컴파일러가 `import` 문에서 어떤것을 참조하는지 알아내기 위해 사용하는 프로세스를 의미합니다.

## 💻 Module Resolution Strategy

임포트한 모듈의 경로의 유형(상대적 모듈 VS 비-상대적 모듈) 따라 컴파일러가 모듈을 찾는 방식이 달라집니다. `TypeScript` 컴파일러가 모듈을 찾는 방식을 `Module Resolution Strategy` 라고 하며, 크기 `Classic` 과 `Node` 방식, 두가지가 있습니다.

🖊 상대적 모듈(relative) VS 비-상대적 모듈(non-relative)

> 상대적 모듈은 `/`, `./`, `../` 와 같이 시작하는 경로를 의미하며, 비-상대적 모듈은 `import * as $ from "jquery"` 와 같은 경로를 의미합니다.

### 👨‍💻 Classic

`Classic` 전략은 `TypeScript` 에서만 사용되는 방식으로, 이전 버전과의 호환성을 위해 주로 사용됩니다.

#### 🙋‍♂️ 상대적 모듈

상대적 모듈이 임포트 되었을 경우, 현재 파일의 상대적인 위치에서 모듈을 찾습니다.

```typescript
// /root/src/folder/A.ts
import { b } from "./moduleB";
```

위와 같이 임포트했을때, 모듈을 탐색하는 순서는 다음과 같습니다.

> 1. <span style="color:cyan">/root/src/folder/moduleB.ts</span>
> 2. <span style="color:cyan">/root/src/folder/moduleB.d.ts</span>
> 3. <span style="color:red">Error: Cannot find module</span>

#### 🙋‍♂️ 비-상대적 모듈

비-상대적 모듈을 임포트할 경우, 현재 디렉토리에서 `.ts`, `.d.ts` 파일을 탐색하고 없을 경우 상위 디렉토리로 이동해 같은 과정을 반복합니다.

```typescript
// /root/src/folder/A.ts
import { b } from "moduleB";
```

위와 같이 임포트 할 경우, 다음과 같이 탐색합니다.

> 1. <span style="color:cyan">/root/src/folder/moduleB.ts</span>
> 2. <span style="color:cyan">/root/src/folder/moduleB.d.ts</span>
> 3. <span style="color:cyan">/root/src/moduleB.ts</span>
> 4. <span style="color:cyan">/root/src/moduleB.d.ts</span>
> 5. <span style="color:cyan">/root/moduleB.ts</span>
> 6. <span style="color:cyan">/root/moduleB.d.ts</span>
> 7. <span style="color:cyan">moduleB.ts</span>
> 8. <span style="color:cyan">moduleB.d.ts</span>
> 9. <span style="color:red">Error: Cannot find module</span>

### 👨‍💻 Node

`Node` 의 `module resolution` 방식을 모방한 방식으로 `Node` 환경에서 `TypeScript` 프로젝트를 동작하게끔 하기위해 사용됩니다.

#### 🙋‍♂️ 상대적 모듈

```typescript
// /root/src/folder/moduleA.ts
import { b } from "./moduleB";
```

위와 같은 상대적 모듈을 `Node` 전략에서는 다음과 같이 탐색합니다.

> 1. <span style="color:cyan">/root/src/folder/moduleB.ts</span>
> 2. <span style="color:cyan">/root/src/folder/moduleB.d.ts</span>
> 3. <span style="color:cyan">/root/src/folder/moduleB/package.json</span> --> [types/typing]
> 4. <span style="color:cyan">/root/src/folder/moduleB/index.ts</span>
> 5. <span style="color:cyan">/root/src/folder/moduleB/index.d.ts</span>
> 6. <span style="color:red">Error: Cannot find module</span>

상대경로에 명시된 디렉토리에서 `.ts`, `.d.ts` 파일을 탐색한 후, 없을 경우 디렉토리로 간주해 `package.json` 을 탐색합니다. 그 다음 `package.json` 의 `types` 나 `typing` 필드에 명시되어 있는 `declaration file` 을 임포트 하게 됩니다.  
만약 `package.json` 파일이 없을 경우 해당 디렉토리에서 `index.ts` 나 `index.d.ts` 를 탐색합니다.

#### 🙋‍♂️ 비-상대적 모듈

비-상대적 모듈을 임포트할 경우, 현재의 디렉토리에서 `node_modules` 디렉토리를 찾는다는 점을 제외하고 상대적 모듈을 임포트하는 것과 동일합니다.

```typescript
// /root/src/folder/moduleA.ts
import { b } from "moduleB";
```

> 1. <span style="color:cyan">/root/src/folder/node_modules/moduleB.ts</span>
> 2. <span style="color:cyan">/root/src/folder/node_modules/moduleB.d.ts</span>
> 3. <span style="color:cyan">/root/src/folder/node_modules/moduleB/package.json</span> --> [types/typing]
> 4. <span style="color:cyan">/root/src/folder/node_modules/moduleB/index.ts</span>
> 5. <span style="color:cyan">/root/src/folder/node_modules/moduleB/index.d.ts</span>
>
> 6. <span style="color:cyan">/root/src/node_module/moduleB.ts</span>
> 7. <span style="color:cyan">/root/src/node_modules/moduleB.d.ts</span>
> 8. <span style="color:cyan">/root/src/node_modules/moduleB/package.json</span> --> [types/typing]
> 9. <span style="color:cyan">/root/src/node_modules/moduleB/index.ts</span>
> 10. <span style="color:cyan">/root/src/node_modules/moduleB/index.d.ts</span>
>
> 11. <span style="color:cyan">/root/node_modules/moduleB.ts</span>
> 12. <span style="color:cyan">/root/node_modules/moduleB.d.ts</span>
> 13. <span style="color:cyan">/root/node_modules/moduleB/package.json</span> --> [types/typing]
> 14. <span style="color:cyan">/root/node_modules/moduleB/index.ts</span>
> 15. <span style="color:cyan">/root/node_modules/moduleB/index.d.ts</span>
>
> 16. <span style="color:cyan">/node_modules/moduleB.ts</span>
> 17. <span style="color:cyan">/node_modules/moduleB.d.ts</span>
> 18. <span style="color:cyan">/node_modules/moduleB/package.json</span> --> [types/typing]
> 19. <span style="color:cyan">/node_modules/moduleB/index.ts</span>
> 20. <span style="color:cyan">/node_modules/moduleB/index.d.tss</span>
>
> 21. <span style="color:red">Error: Cannot find module</span>

##### 🖊 `Node` 의 `module resolution`

> `TypeScript` 의 `Node` 방식이 `Node` 의 `module resolution` 방식을 모방한 것이기 때문에 유사합니다.
>
> - 상대적 모듈
>
> ```javascript
> // /root/src/moduleA.js
> var x = require("./moduleB");
> ```
>
> 위의 경우 다음과 같은 순서로 탐색합니다.
>
> > 1. <span style="color:cyan">/root/src/moduleB.js</span>
> > 2. <span style="color:cyan">/root/src/moduleB/package.json</span> --> [main]
> > 3. <span style="color:cyan">/root/src/moduleB/index.js</span>
>
> - 비-상대적 모듈
>
> ```javascript
> // /root/src/moduleA.js
> var x = require("moduleB");
> ```
>
> > 1. <span style="color:cyan">/root/src/node_modules/moduleB.js</span>
> > 2. <span style="color:cyan">/root/src/node_modules/moduleB/package.json</span> --> [main]
> > 3. <span style="color:cyan">/root/src/node_modules/moduleB/index.js</span>
> >
> > 4. <span style="color:cyan">/root/node_modules/moduleB.js</span>
> > 5. <span style="color:cyan">/root/node_modules/moduleB/package.json</span> --> [main]
> > 6. <span style="color:cyan">/root/node_modules/moduleB/index.js</span>
> >
> > 7. <span style="color:cyan">/node_modules/moduleB.js</span>
> > 8. <span style="color:cyan">/node_modules/moduleB/package.json</span> --> [main]
> > 9. <span style="color:cyan">/node_modules/moduleB/index.js</span>
