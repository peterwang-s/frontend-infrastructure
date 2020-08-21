
### 特性demo

+ [webpack-library-example](https://github.com/kalcifer/webpack-library-example)

### compatibility 兼容性

+ import() 调用会在内部用到 promises。如果在旧版本浏览器中使用 import()，记得使用一个 polyfill 库（例如 es6-promise 或 promise-polyfill），来 shim Promise

### 词汇表

+ shim 垫片
+ polyfill 填充脚本
+ 动态导入(dynamic import) 
```
    import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {})
```
+ 预获取/预加载模块(prefetch/preload module)
    + prefetch(预获取)：将来某些导航下可能需要的资源,浏览器在闲置时间预取 
    + preload(预加载)：当前导航下可能需要资源
+ resource hint(资源提示，预取提示)
    + ``` import(/* webpackPrefetch: true */ 'LoginModal'); ```
    + ``` <link rel="prefetch" href="login-modal-chunk.js"> ```
    + ``` import(/* webpackPreload: true */ 'ChartingLibrary'); ```


### 概念


### 拓展知识点

+ async 函数，需要使用像 Babel 这样的预处理器和 Syntax Dynamic Import Babel Plugin


### 官方loader
### 官方plugin

+ [SplitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin) 可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。 配置 optimization.splitChunks
+ [clean-webpack-plugin]()
+ [html-webpack-plugin]()


### 社区plugin和loader

+ mini-css-extract-plugin: 用于将 CSS 从主应用程序中分离。
