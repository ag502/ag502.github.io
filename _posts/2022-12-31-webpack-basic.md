---
title: Webpack 기본 설정
date: 2022-12-31
categories: [webpack 톺아보기]
tags: [webpack]
image:
  path: /assets/img/webpack-main.jpeg
  alt: webpack logo
---

## 💻 Webpack 이란?

Webpack은 프로젝트에 임포트된 여러 모듈들을 의존성에 따라 묶어주어, 하나 이상의 번들을 생성해 주는 번들러(bundler)의 한 종류 입니다. 프로젝트의 규모가 커지게되고 임포트하는 모듈들이 많아질수록 번들러의 중요성이 커지게 되었는데 그 이유를 알아보겠습니다.

아래와 같은 두개의 JavaScript 파일이 있다고 가정해보겠습니다.

```javascript
// src/intro.js

function intro() {
  console.log("this is intro page");
}
```

```javascript
// src/index.js

intro();
```

`intro.js`는 단순히 메세지 출력하는 함수를 정의한 파일이며, `index.js`는 정의한 함수를 호출하고 있습니다. 이제 두 파일을 `html` 파일에 임포트 해보겠습니다.

```html
<!-- index.html -->
<body>
  <script src="./src/intro.js"></script>
  <script src="./src/index.js"></script>
</body>
```

위 단계까지 마친 후 `html` 파일을 실행해보면, 콘솔창에 `this is intro page` 라는 메세지가 출력됩니다.

만약 `html` 파일에 임포트 순서를 바꾸게되면, 올바른 결과가 나오지 않게됩니다. `index.js` 파일은 `intro` 함수를 실행하려 하는데, `intro` 함수가 정의된 `intro.js` 파일은 실행시점에 아직 임포트 되지 않았기 때문입니다. 위 예시에서는 파일의 갯수가 적어 문제점을 바로 찾을 수 있었지만 프로젝트 규모가 커져 `html` 파일에 임포트해야 하는 파일이 수백개에 이르게 되면, 문제를 찾기 어려워 집니다. 모든 파일의 의존성을 고려해 올바른 순서로 임포트를 해주어야 하기 때문입니다.

Webpack과 같은 번들러를 사용하게 되면, 위 문제를 쉽게 해결할 수 있습니다. Webpack이 의존성 관계를 따져 하나 이상의 번들링된 파일을 만들게 되면, 개발자는 만들어진 파일만 임포트하면 됩니다.

지금까지 webpack이 무엇이며, 왜 필요한지를 살펴 보았습니다. 이제 webpack을 사용하기 위한 설정들을 살펴보겠습니다.

## 💻 webpack, webpack-cli 설치

설정을 알아보기 전에, webpack과 webpack-cli를 `devDependencies`로 설치해야 합니다. webpack-cli의 경우 `package.json`의 script 명령어를 사용해 webpack과 관련된 기능(빌드, 실행등)을 실행할 수 있습니다.

🖊 만약 webpack 설정없이 `webpack` 명령어를 실행하게되면, 기본 설정으로 빌드되게 됩니다.

## 💻 entry, output 프로퍼티

제일 먼저 살펴볼 webpack 설정 프로퍼티는 `entry`, `output` 입니다.  
`entry`에는 빌드가 시작되는 시작점 파일, 즉 의존성 그래프에서 최상단에 위치하는 파일를 지정하게 되며, `output`에는 빌드가 완료된 결과물의 이름과 결과물이 위치할 폴더의 경로 및 폴더의 이름등을 설정해주게 됩니다.

```javascript
// src/intro.js
function intro() {
  console.log("this is intro page");
}

// src/index.js
import intro from "./intro.js";

intro();
```

위의 예시에서 `entry`는 `src/index.js`가 됩니다. 따라서 webpack 설정을 아래와 같이 지정할 수 있습니다. 빌드의 시작점이 되는 파일은 반드시 하나일 필요는 없습니다. 하나가 아닌 예시는 이후에 알아보겠습니다.

```javascript
// webpack.config.js

module.exports = {
  entry: "./src/intro.js",
};
```

`output`은 아래와 같이 설정해 줄 수 있습니다.

```javascript
module.exports = {
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

위 설정의 의미는 빌드가 완료된 결과물을 `bundle.js`로 명명하고, 파일을 위치를 `dist/bundle.js`에 위치 시키라는 의미입니다.

위 설정대로 빌드를 하게 되면 결과는 아래와 같이 나오게 됩니다.

![entry-output build](/assets/img/basic-webpack/entry-output.png)

> 🖊 Webpack 설정 파일은 파일명을 `webpack.config.js`로 지정해 루트 폴더에 생성하면, webpack이 자동으로 설정파일을 인식하게 됩니다.

#### 🖊 Browser Cache

> 우리가 사용하는 웹 브라우저들은 캐시를 사용하고 있습니다. 한번 네트워크 요청을 보낸 파일들은 기억해 놓았다가 다음 요청이 들어올 때, 캐시에서 파일을 가져옵니다. 이를 통해 로딩시간을 단축시킬 수 있다는 장점이 있습니다.  
> 하지만 캐시로 인해 문제도 발생합니다. 어떤 상황에서 문제가 발생하는지 한가지 상황을 가정해보겠습니다.
>
> 어떤 사용자가 자주 사용하고 있는 웹 서비스가 있습니다. 이 서비스의 개발자는 새로운 디자인을 적용해 빌드 후 배포했지만, 사용자는 바뀐 디자인을 바로 보지 못합니다. 브라우저의 캐시로 인해 예전 `html` 파일을 기억하고 있기 때문입니다.  
> 이 문제는 해결하기 위한 방법으로는 빌드된 파일명에 `hash` 값을 추가하는 방법이 있습니다. `output.filename`에 `[contenthash]`를 추가하면 빌드될 때마다 파일명에 `hash` 값이 추가되어 매번 다른 이름의 파일이 생성됩니다. 이를 통해 브라우저의 캐시를 피할 수 있습니다.

## 💻 Asset Modules

Webpack은 임포트한 모듈 중, JavaScript만 알아 볼 수 있습니다. 다시말해 이미지 파일이나, 텍스트 파일, `CSS` 파일등 JavaScript가 아닌 파일을 임포트하게 되면 빌드시 오류가 생기게 됩니다. 다른 종류의 파일들을 임포트하려면 추가적으로 설정을 해주어야 합니다.  
Asset Module은 이미지, 글꼴, 텍스트와 같은 asset 파일을 webpack이 해석할 수 있도록 도와주는 역할을 합니다. 과거에는 `url-loader`, `file-loader`등을 설치해야 했지만, webpack5부터는 기본 기능으로 통합되었습니다.

Asset Module은 asset 파일 임포트 방식에 따라 세가지 종류로 나눌 수 있습니다.

### 👨‍💻 asset/resource

빌드시 모듈이 적용된 파일을 `output` 디렉토리에 생성합니다. 이때 별도의 파일명을 지정하지 않으면, 해쉬된 값이 파일명으로 지정되게 됩니다.  
 이 모듈을 적용할 경우, 파일을 불러올때 `http` 요청을 보내며, 보통 크기가 큰 파일을 가져올때 사용합니다. 설정은 아래와 같이 할 수 있습니다.

```javascript
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        // 확장자가 png, jpg인 파일에 모듈 적용
        test: /\.(png|jpg)$/,
        type: "asset/resource",
      },
    ],
  },
};
```

위 설정대로 빌드를 하게되면 결과는 다음과 같습니다.

![asset-resource](/assets/img/basic-webpack/asset-resource.png)

위에서 언급했듯이 임포트된 이미지파일이 `output` 디렉토리에 따로 생성되었습니다.

> 🖊 생성되는 asset 파일의 이름이나 경로를 바꾸고 싶다면 [Custom output filename](https://webpack.js.org/guides/asset-modules/#custom-output-filename)을 참조하면 됩니다.

### 👨‍💻 asset/inline

별도의 파일을 `output` 디렉토리에 생성하지 않고, 파일을 data url(base64) 형식으로 바꾸어 번들링된 JavaScript 파일에 직접 넣습니다. 보통 크기가 작은 파일을 처리할 때 사용합니다.

```javascript
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: "asset/inline",
      },
    ],
  },
};
```

위 설정으로 빌드를 할 때, 빌드 결과물의 용량이 `asset/resource`로 빌드했을때보다 커지는 것을 볼 수 있습니다. 번들링된 결과물에 data url이 추가되었기 때문입니다.

![asset-inline-bundle-size](/assets/img/basic-webpack/asset-inline-size.png)

### 👨‍💻 asset

`asset/resource`과 `asset/inline`을 합친 방식입니다. 특정 크기 이상이면 `asset/resource`로 빌드하고 미만일 경우는 `asset/inline`으로 빌드합니다. 기준이 되는 값은 8kb이며, 직접 설정할 수 있습니다.

```javascript
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            // 3kb 이상일 경우, asset/resource로 빌드
            maxSize: 3 * 1024,
          },
        },
      },
    ],
  },
};
```

### 👨‍💻 asset/source

파일의 텍스트를 문자열로 읽어 JavaScript에 주입하기 위해 사용합니다. `asset/inline`과 동일하게 `output` 디렉토리에 새로운 파일을 생성하지 않습니다.

```javascript
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        type: "asset/source",
      },
    ],
  },
};
```

#### 🖊 publicPath

> `output` 프로퍼티에 `publicPath`라는 옵션이 있습니다. 이 옵션은 생성된 파일들을 브라우저에 로딩하기 위해 어떤 `url`을 사용해야하는지 webpack에 알려주는 역할을 합니다.  
> `publicPath`에 아무런 설정을 해주지 않고 `asset/resource`방식으로 이미지를 임포트 했다고 가정해보겠습니다. 개발자 도구에서 해당 이미지의 `src` 속성을 보면 `http://[domain name]/dist/[image name][ext]` 형식으로 되어있는 것을 볼 수 있습니다. 이는 webpack5에서 `publicPath`가 `auto`이기 때문입니다. Webpack4의 경우는 빈 문자열("") 이므로 따로 설정을 해주지 않으면, 파일이 로드되지 않습니다.
>
> Webpack5에서 자동으로 asset들의 경로를 설정해 줌에도 따로 지정해야하는 이유가 있을까요?  
> 이 옵션은 정적 파일들을 cdn서버나, 특수한 prefix가 붙은 서버에 저장했을 경우 유용합니다.
>
> ```javascript
> // webpack.config.js
>
> module.exports = {
>   output: {
>     filename: "bundle.js",
>     path: path.resolve(__dirname, "dist"),
>     publicPath: "http://~~~cdn.com/",
>   },
> };
> ```
>
> 위와 같이 `publicPath`를 설정해주게 되면, 이미지 파일의 경로는 아래와 같이 나오게됩니다.
>
> ![publicPath-cdn](/assets/img/basic-webpack/publicPath.png)

## 💻 loader

`loader`는 모듈로 가져올 수 없는 파일들을 로드 할 때 사용합니다. 대표적인 `loader`로는 `CSS` 파일을 로드할 때 사용하는 `style-loader` 와 `css-loader`, 폴리필을 할 때 사용하는 `babel-loader`가 있습니다.

### 👨‍💻 css-loader

`css-loader`는 `CSS` 파일을 읽어 번들링 된 JavaScript 코드에 스타일을 넣어주는 역할을 합니다.

```javascript
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["css-loader"],
      },
    ],
  },
};
```

위와 같이 설정한 후 빌드를 실행하게 되면, 번들링된 결과에 `CSS` 파일이 코드로 변환된 것을 볼 수 있습니다. 하지만 스타일을 코드로 변환하기만 해서는 스타일을 적용할 수 없습니다. 변환된 결과를 태그를 통해 페이지에 삽입해야 합니다.

### 👨‍💻 style-loader

`css-loader`를 통해 변환된 `CSS` 파일을 `style` 태그에 넣어주는 역할을 합니다.

```javascript
// webpack.config.js

module.exports = {
  module: {
    rules: [
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    ]
  }
}
```

위와 같이 설정한 후 빌드를 실행하게 되면 아래와 같이, `head` 태그 하위에 `style` 태그가 생긴것을 볼 수 있습니다.

![style-loader](/assets/img/basic-webpack/style-loader.png)

#### 🖊 loader 적용순서

> `style-loader`를 적용한 webpack 설정을 보면 `use` 프로퍼티에
>
> ```javascript
> ["style-loader", "css-loader"];
> ```
>
> 순으로 적용한것을 알 수 있습니다. `loader`는 배열의 역순으로 적용이 되기때문에 위 순서를 지키지 않을시 제대로 동작하지 않습니다.  
> 위 선언을 말로 풀어 설명하자면, `css-loader`를 사용해 `CSS` 파일을 읽어 번들링된 JavaScript 코드에 넣은 후, `style-loader`를 사용해 `style` 태그에 넣어준다는 의미 입니다.

### 👨‍💻 sass-loader

`sass-loader`는 `SCSS` 나 `SASS` 파일을 읽어들일 수 있게끔 해주는 `loader` 입니다. 이 `loader`는 `css-loader`보다 먼저 적용되게끔 설정해 주어야 합니다.

```javascript
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
```

### 👨‍💻 babel-loader

`babel-loader`의 경우는 최신 JavaScript 문법을 모든 브라우저에서 사용할 수 있도록 폴리필을 도와주는 `loader` 입니다. 사용하고자하는 `plugin`들이나, `preset`들을 함께 설정해줄 수 있습니다.

```javascript
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          presets: ["@babel/env"],
          plugins: ["@babel/plugin-proposal-class-properties"],
        },
      },
    ],
  },
};
```

## 💻 plugin

`loader`는 파일이나 모듈을 임포트하는데 사용했다면, `plugin`의 경우는 그 외의 추가적인 기능을 수행하게끔 도와줍니다. 대표적인 `plugin`의 종류와 역할을 살펴보겠습니다.

### 👨‍💻 terser-webpack-plugin

번들링된 JavaScript 파일의 크기를 줄여주는 `plugin` 입니다. Webpack4에서는 `npm` 모듈로 설치해주어야 했으나, webpack5에서는 내장되었습니다.

아래와 같이 설정해 사용할 수 있으며, 결과물은 다음과 같습니다.

```javascript
// webpack.config.js
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  plugins: [new TerserPlugin()],
};
```

![terser-plugin](/assets/img/basic-webpack/terser-plugin.png)

`terser-webpack-plugin`의 경우 개발중일때는 사용하지 않습니다. 빌드 시간이 오래걸리기 때문입니다. 또한 실제 배포를 할 경우에는 자동으로 기본설정이 적용되어 빌드됩니다.

### 👨‍💻 mini-css-extract

`css-loader`와 `style-loader`를 사용하게되면, `CSS`속성들이 번들링된 파일에 들어가기 때문에 결과물의 용량이 커지게 됩니다. 만약 `CSS`만 따로 추출한다면, 번들링된 결과물의 용량이 줄일 수 있습니다.

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.[name].css",
    }),
  ],
};
```

위와 같이 설정할 수 있으며, 빌드된 결과는 아래와 같습니다.

![mini-css-extract](/assets/img/basic-webpack/mini-css-extract.png)

위 그림과 같이 임포트한 `CSS`파일이 별도의 파일로 분리된것을 알 수 있습니다.

#### 🖊 mini-css-extract 옵션

> 번들링된 `CSS`의 파일명이나 위치를 변경하고 싶다면, 인스턴스 생성시에 옵션들을 인자로 넘겨주면 변경할 수 있습니다.

### 👨‍💻 clean-webpack-plugin

빌드가 실행되기전 `output` 디렉토리에 있는 이전 결과물들을 모두 지워주는 역할을 합니다.

```javascript
// webpack.config.js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  plugins: [new CleanWebpackPlugin()],
};
```

### 👨‍💻 html-webpack-plugin

지금까지는 빌드 결과물로 나온 JavaScript 파일이나 `CSS` 파일들을 직접 `html` 파일에 임포트해 실행했습니다. 결과물로 나온 파일의 갯수가 적거나 이름이 단순하다면 큰 문제가 되지 않지만, 그 반대의 경우는 불편할 수 있습니다. 이런 문제를 `html-webpack-plugin`으로 해결할 수 있습니다.  
`html-webpack-plugin`의 경우 번들링 결과로 나온 파일들을 자동으로 `html`파일에 넣어주는 역할을 합니다.

```javascript
// webapck.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [new HtmlWebpackPlugin()],
};
```
