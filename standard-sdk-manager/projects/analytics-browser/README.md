## 使用说明

将代码放在 head 或者其他 js 脚本之前添加

```
(function(n,e,t,a,i){var o="pageStartTime";var r="HuamiBrowserAnalytics";n[o]=Date.now();n[r]={config:{},queue:[]};n[i]={init:function(e){n[r].config=e},push:function(e){n[r].queue.push(e)}};if("PerformanceLongTaskTiming"in window){var c=window.__tti={e:[]};c.o=new PerformanceObserver(function(e){c.e=c.e.concat(e.getEntries())});c.o.observe({entryTypes:["longtask"]})}var s=e.createElement(t);s.onload=s.onreadystatechange=function(){var e=s.readyState;if(typeof e==="undefined"||e==="loaded"||e==="complete"){try{window[i]=window["Analytics"];if(window[i])window[i].ready()}finally{s.onload=s.onreadystatechange=null}}s.onreadystatechange=null};s.async=true;s.setAttribute("type","text/javascript");s.setAttribute("src",a);document.head.appendChild(s)})(typeof window!=="undefined"?window:this,document,"script","https://fe-cdn.huami.com/analytics-browser/1.2.7/analytics.min.js",
"HM_Analytics");
```

最新 SDK 地址是 https://fe-cdn.huami.com/analytics-browser/1.2.9/analytics.min.js

我们将会进行几步操作

1. 创建一个 script 标签,引入我们的 SDK
2. 初始化一个全局变量 HM_Analytics, 如果你想换成其他名称，可以把引入代码段的最后一个单词'HM_Analytics'替换成你想要的变量名
3. 加载完成

## 初始化

加载完统计 Javascript SDK 后, 你需要进行初始化设置，方法如下:

```
  HM_Analytics.init(config)
```

#### 具体配置字段

| 字段 | 必选/可选 | 类型 | 含义 | 可选值 |
| :-: | :-: | :-: | :-: | :-: |
| debug | 必选 | Boolean | 是否测试环境 | true/false,建议根据 process.env 来判断 |
| clients | 必选 | Object | 具体的统计平台和对应的 id | 华米打点使用 appid,百度使用 siteId |
| namespace | 必选 | String | 华米打点文档里约定的 namespace |
| usid | 可选 | String | 用户 id | 可以通过 jsbridge 拿到,如果没有,由后台生成 |
| isSPA | 可选 | Boolean | 是否单页面应用 | true/false |
| autoPushPV | 可选 | Boolean | 是否自动统计 PV | 单页面应用自动统计 PV（isSPA=true） |
| autoOPT | 可选 | Boolean | 是否自动统计页面停留时间 | true/false |

---

- 使用示例
  ```
  HM_Analytics.init({
      debug: ENV !== 'pro',
      clients: {
        huami: '华米ID,由大数据团队提供',
        baidu: '百度统计的SiteId'
      },
      namespace: 'Discover_Choice',
      isSPA: false,
      autoPushPV: false,
  })
  ```
  为保证数据准确性，建议使用手动打点记录当前首屏时间。

## 方法

##### PV 统计

固定使用常量字段\_trackPageview 标识 PV 统计

```
  HM_Analytics.push(['_trackPageview'])
```

##### 事件统计

```
  HM_Analytics.push(['_trackEvent', category, action, opt_label, options])
```

---

|   名称    | 必选/可选 |  类型  |                   功能                    |
| :-------: | :-------: | :----: | :---------------------------------------: |
| category  |   必选    | String | 要监控的目标的类型名称，对应华米参数的 tp |
|  action   |   必选    | String |       用户跟网页进行交互的动作名称        |
| opt_label |   必选    | String |  事件的一些额外信息，对应的华米参数的 n   |
|  options  |   必选    | Object |                 扩展参数                  |

---

- category：要监控的目标的类型名称，对应华米打点参数的 tp。
- action：用户跟目标交互的行为，如"点击"、"曝光"。
- opt_label：事件的一些额外信息，也可以使用华米打点参数里的 n。
- options: 华米打点文档要传入的扩展参数，对应华米的 ep，比如记录页面素材 id 第等。
- opt_value：options 的参数之一，百度打点统计需要，代表事件的一些数值信息，比如权重、时长、价格等等。

示例

```
  HM_Analytics.push(['_trackEvent','hservice_banner', '曝光', '素材标题', {
    opt_value: 1,
    id: '素材ID',
    pos: '素材位置0-M'
  }])
```

##### 曝光事件统计

```
<div class="hmrp-expose" data-$hmex="{'id':'素材5','pos':'素材位置Bottom','tp':'免责声明','n':'曝光区块'}">你看到我了</div>
```

- 添加 class 名为 hmrp-expose
- 添加 data-\$hmex，自定义上报数据，格式为{'id':'素材 5','pos':'素材位置 Bottom','tp':'免责声明','n':'曝光区块'}
- tp 为 打点内容 ， n 为曝光类型说明，id 为元素 id，pos 描述页面位置

##### 首屏时间统计

```
  HM_Analytics.push(['_trackFMP'])
```

示例

```
  HM_Analytics.push(['_trackFMP'])
```

## 性能指标 FAQ

- #### 指标列表
  |      名称      |       指标       |  类型  |                解释                |
  | :------------: | :--------------: | :----: | :--------------------------------: |
  |    白屏时间    |  FirstPaintTime  | Number |     浏览器出现第一个元素的时间     |
  |    首屏时间    |       FMP        | Number |         首屏加载完成的时间         |
  | 页面可交互时间 | InteractiveTime  | Number | 用户可以与浏览器进行交互操作的时间 |
  |    停留时间    |    OnPageTime    | Number |       用户在网页上停留的时间       |
  |  DNS 查询时间  | LookupDomainTime | Number |
  |  TCP 连接时间  |   ConnectTime    | Number |
  |  资源加载时间  |   NetworkTime    | Number |
  | DomReady 时间  |   DomReadyTime   | Number |
  ***
- #### 白屏时间
  白屏时间 = 地址栏输入网址后回车 - 浏览器出现第一个元素
  ```
    DOM Ready时间 - timing.navigationStart
  ```
- #### 首屏时间的统计 (First Meaning Paint)

  首屏时间 = 地址栏输入网址后回车 - 浏览器第一屏渲染完成

  ##### 传统页面

  传统页面大部分是传统服务器端渲染， 这个时候我们认为图片是最后完成加载的，所以我们只需要统计图片加载完成的时间,最终的页面加载时间就是 DOM Ready 时间 + 传输图片时间。

  ##### SPA(single-page application)

  对于单页面应用，我们可以使用埋点 + 监听图片时间来获得，但是这样侵入性会比较强。 还有一中做法是，业务中我们都是 ajax 请求获取数据,然后拼接 html。所以可以拦截首个 ajax,以他们的返回时间来得到一个时间 T1,然后使用 MutationObserver 来不断监听 DOM 变化，直到最后稳定,来获得一个时间。为了避免页面间隔时间变长，我们设置个统计超时时间，比如 8 秒。在页面不断变化中，我们统计一个加载趋势。

- #### 页面可交互时间
- #### 页面停留时间的统计（Time on Page）

  - ##### 业界通常做法
    - Google/Baidu 记录 A 页面的访问时间，假如跳转到 B，那么就用 B 的访问时间减去 A 的访问时间
    - 心跳
    - 事件监听
  - ##### 传统页面

    - 常规页面加载、刷新、关闭可以通过 window.onbeforeunload 来监听页面离开
    - 需要注意处理的地方是用户的其他操作,比如最小化浏览器、切换 tab、切换窗口、前进后退.
    - HTML5 visibilitychange, 只支持 IE10 +
    - 不支持 Page Visibility API 的页面使用 focus/blur，但是会造成不准确的统计(需要用户点击触发 focus)
    - 浏览器的后退, 使用 pageshow 监听

  - ##### SPA(single-page application)
    - 使用 HTML5 history api 监听单页面应用的变化，对 pushstate 和 replacestate 进行 hack
    - 旧版本浏览器使用 hashchange
  - ##### 统计数据的传输
    - 统计的成功率 onunload 事件中发送网络请求，事件结束后页面资源会被释放掉，这个时候我们的数据无法保证发送成功。所以我们通常要使用同步的 XMLHttpRequest,或者使用 navigator.sendBeacon 来发送。
    - 设置最大数值 用户有可能一直停留在当前页面,这个时候我们拿到的停留时间可能是个超级大整数,所以我们设置了一个上限，比如 3 天
