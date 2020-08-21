## sdk repo

统一 sdk 维护方法，指定代码规范、语言版本、工具链、发布版本规范，使其符合[sdk 执行标准]()，

### 使用指南

- 在 projects 文件夹下，手动新建项目
- 将 template 文件夹下的代码，复制到新[SDK 文件夹]文件目录下
  - 修改 template 中，package.json 文件配置，包括 main、module、cjs:main 配置，该配置影响打包名称
- 在根目录下，运行 SDK=[SDK 文件夹名称] yarn start 本地调试
- 在根目录下，运行 SDK=[SDK 文件夹名称] yarn build 进行脚本打包
- 在根目录下，运行 SDK=[SDK 文件夹名称] NPM=publish yarn build 进行 NPM 打包
- 在根目录下，运行 yarn pub 进行 NPM 发布

### 打包模块类型说明

- amd – 异步模块定义,用于像 RequireJS 这样的模块加载器
- cjs – CommonJS,适用于 Node 和 Browserify/Webpack 例如 require('')
- es – 将软件包保存为 ES 模块文件 例如 import storage from ''
- iife – 一个自动执行的功能,适合作为<script>标签.（如果要为应用程序创建一个捆绑包,您可能想要使用它,因为它会使文件大小变小.）
- umd – 通用模块定义,以 amd,cjs 和 iife 为一体,umd 是 amd 和 CommonJS 的糅合,umd 先判断是否支持 Node.js 的模块（exports）是否存在,存在则使用 Node.js 模块模式.

### [SDK 文件夹下]package.json 配置

```
"main": "analytics.common.js",
"module": "analytics.cjs.js",
"jsnext:main": "analytics.esm.js",
"cjs:main": "analytics.cjs.js",
"browser": "analytics.min.js",
"browser:source": "analytics.js",
```

main 指定了 npm 默认导入的入口文件，目前格式为 ES 模块打包方式。browser 指定了浏览器打包文件名称，打包格式为 UMD 模块打包方式

### 项目文件夹

- 根目录
  - coverage 测试覆盖率报告
  - dist 打包文件夹
  - projects 项目文件夹
    - template 模版项目
      - deprecated 老版本代码
      - examples 本地调试代码
      - packages sdk 源代码
        - index.js 入口文件
      - install.js 页面加载脚本
      - test 单元测试代码
  - .babelrc es 编译器
  - .commitlintrc.js commit 工具
  - .gitignore git 忽略清单
  - .npmignore npm publish 忽略清单
  - .prettierignore
  - .prettierrc.js
  - rollup.config.js
  - .npmrc 指定了 发布地址，
