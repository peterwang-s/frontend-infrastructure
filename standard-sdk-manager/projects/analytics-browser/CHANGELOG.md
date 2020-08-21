## 1.2.9 (2020-06-15)

### Features

- 代码演进，修复循环依赖导致代码运行不稳定，难以进行代码测试的问题。同时优化代码语法规范。弃用 webpack，改为 rollup，减少了打包体积和打包时间，增加多平台打包逻辑。改进代码文件和模块结构。增加 commitlint，changelog-cli 增强代码自文档化程度。 ([bd8b00b](http://gerrit.huami.com:29418/server/aos-fe-components/commits/bd8b00b79471f90f2e434816955cf131464fbfe0))
- 添加工具链，eslint、prettierh、usky、lint-staged ([96dfcdc](http://gerrit.huami.com:29418/server/aos-fe-components/commits/96dfcdc90312abd0aaa83f4f55dcb31f1af3a354))
- 脚手架切换 rollup，优化脚本性能 ([49fea38](http://gerrit.huami.com:29418/server/aos-fe-components/commits/49fea385bbd3b551b0adb2429a8b9736e3588ef9))

## [1.2.5] - 增加性能统计时对数值异常数据的过滤，保证数据的准确性。

```
 具体阈值为：
    requestTime: 2000,
    interactiveTime: 10000,
    connectTime: 1000,
    firstPaintTime: 3000,
    domReadyTime: 5000,
    lookupDomainTime: 1000,
    networkTime: 3000
```

## [1.0.25] - 2018/11/16

### Changed

- 去除 proxy xhr

## [1.0.24] - 2018/11/29

### Changed

- 增加参数判空校验

### Fixed

- 修复初始化 config 为空导致的错误

### Added

- 重新约定接口参数和格式
- 调整示例文档

## [1.0.23] - 2018/11/16

### Added

- sdk 打点统计，兼容百度和华米
- sdk 使用文档

[1.0.25]: https://aos-cdn.huami.com/analytics-browser/1.0.25/analytics.min.js
[1.0.24]: https://aos-cdn.huami.com/analytics-browser/1.0.24/analytics.min.js
[1.0.23]: https://aos-cdn.huami.com/analytics-browser/1.0.23/analytics.min.js
