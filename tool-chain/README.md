### 工具链说明

工具链与集成开发环境形成对照，与相关的前端持续集成测试发布系统相匹配。

### npm 项目配置

#### 基础工具

1. conventional-changelog-cli
通过git commit log 自动添加 CHANGELOG.md


### webpack/rollup 对比


#### webpack

代码拆分(Code Splitting)或者你有很多静态资源需要处理，使用webpack，

#### rollup打包
1. 可读性强
2. 体积较小，而且没有冗余的代码

限制
rollup默认只支持ES6的模块化，如果需要支持Commonjs，还需下载相应的插件rollup-plugin-commonjs


```
import { uglify } from 'rollup-plugin-uglify';
...

plugins: [
    uglify()
]
```


#### library build 

1. 打包的代码可以兼容各个平台，就需要符合UMD规范(兼容AMD,CMD, Commonjs, iife)


### rollup 

#### 优势

自动 Tree-shaking，打包速度快，配置简单


##### format 代码打包模块规范

* amd – 异步模块定义，用于像RequireJS这样的模块加载器
* cjs – CommonJS，适用于 Node 和 Browserify/Webpack
* es – 将软件包保存为ES模块文件
* iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
* umd – 通用模块定义，以amd，cjs 和 iife 为一体


##### rollup基础插件

* rollup-plugin-alias: 提供modules名称的 alias 和reslove 功能
* rollup-plugin-babel: 提供babel能力
* rollup-plugin-eslint: 提供eslint能力
* rollup-plugin-node-resolve: 解析 node_modules 中的模块
* rollup-plugin-commonjs: 转换 CJS -> ESM, 通常配合上面一个插件使用
* rollup-plugin-serve: 类比 webpack-dev-server, 提供静态服务器能力
* rollup-plugin-filesize: 显示 bundle 文件大小
* rollup-plugin-uglify: 压缩 bundle 文件
* rollup-plugin-replace: 类比 Webpack 的 DefinePlugin , 可在源码中通过 process.env.NODE_ENV 用于构建区分 Development 与 Production 环境.



### 处理 循环依赖 



