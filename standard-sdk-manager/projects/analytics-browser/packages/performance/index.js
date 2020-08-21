import ttiPolyfill from 'tti-polyfill';
import _ from '../utils/index';
import firstScreenTime from './firstScreenTime';
import onPageTime from './onPageTime';

const VALID_LIMIT = {
    requestTime: 2000,
    interactiveTime: 10000,
    connectTime: 1000,
    firstPaintTime: 3000,
    domReadyTime: 5000,
    lookupDomainTime: 1000,
    networkTime: 3000,
};

const Performance = {
    positiveInt(value) {
        // return Math.max(0, Math.round(value || 0));
        return Math.max(0, value.toFixed(4));
    },
    getFirstPaintTime() {
        let firstPaint = 0;
        let time = 0;
        const performance = _.isPerformance;
        const { timing } = performance;
        // IE9+
        if (window.chrome && window.chrome.loadTimes) {
            firstPaint = timing.domLoading;
            time = firstPaint - timing.navigationStart;
        } else if (typeof timing.msFirstPaint === 'number') {
            firstPaint = timing.msFirstPaint;
            time = firstPaint - timing.navigationStart;
        }
        // support browser doesn't has timing api
        if (firstPaint === 0) {
            time = Date.now() - window.pageStartTime;
        }
        // firstPaintTime: timing.responseStart - timing.navigationStart || 0, // 白屏时间
        return time;
    },
    getTimes() {
        return ttiPolyfill.getFirstConsistentlyInteractive().then((tti) => {
            const self = this;
            const performance =
                window.performance ||
                window.webkitPerformance ||
                window.msPerformance ||
                window.mozPerformance;

            if (!performance) return false;

            // 最新标准，性能统计精度更高，同时旧标准已经弃用，增加更多统计内容
            let resources;
            // let marks;
            // let measures;
            let paint;
            // let isSupportRTL2;

            let timing = window.performance && window.performance.timing;
            let startTime = 0;
            if (window.performance && typeof window.performance.getEntriesByType === 'function') {
                resources = window.performance.getEntriesByType('resource');
                // marks = window.performance.getEntriesByType('mark');
                // measures = window.performance.getEntriesByType('measure');
                [timing] = window.performance.getEntriesByType('navigation');
                paint = window.performance.getEntriesByType('paint');
                // isSupportRTL2 = true;
                startTime = timing.startTime;
            } else if (
                window.performance &&
                typeof window.performance.webkitGetEntriesByType === 'function'
            ) {
                resources = window.performance.webkitGetEntriesByType('resource');
                // marks = window.performance.webkitGetEntriesByType('mark');
                // measures = window.performance.webkitGetEntriesByType('measure');
                [timing] = window.performance.webkitGetEntriesByType('navigation');
                paint = window.performance.webkitGetEntriesByType('paint');
                // isSupportRTL2 = true;
                startTime = timing.startTime;
            } else {
                startTime = timing.navigationStart || timing.fetchStart;
            }

            let times = {
                type: 'page',
                // 第一期指标属性
                startTime,
                lookupDomainTime: self.positiveInt(
                    timing.domainLookupEnd - timing.domainLookupStart,
                ), // DNS查询时间
                connectTime: self.positiveInt(timing.connectEnd - timing.connectStart), // TCP连接耗时
                firstPaintTime: this.getFirstPaintTime(), // 白屏时间
                requestTime: self.positiveInt(timing.responseEnd - timing.requestStart), // request请求耗时
                networkTime: self.positiveInt(timing.responseEnd - startTime), // 资源加载时间
                domReadyTime: self.positiveInt(timing.domContentLoadedEventEnd - startTime), // domReady时间

                // 关键性能指标
                fb: self.positiveInt(timing.responseStart - timing.domainLookupStart), // first byte 首字节加载时长，包括了DNS，TCP
                fpt: self.positiveInt(timing.responseEnd - timing.fetchStart), // first paint time 白屏
                tti: self.positiveInt(timing.domInteractive - timing.fetchStart), // 首次可交互
                ready: self.positiveInt(timing.domContentLoadedEventEnd - timing.fetchStart),
                load: self.positiveInt(timing.loadEventStart - timing.fetchStart),
            };
            console.log('timing.domInteractive ', timing.domInteractive);

            // 时间分区统计数据
            const stage = {
                // 第二期指标属性 资源加载统计
                total: self.positiveInt(timing.loadEventEnd - startTime),
                unload: self.positiveInt(timing.unloadEventEnd - timing.unloadEventStart),
                redirect: self.positiveInt(timing.redirectEnd - timing.redirectStart),
                appCache: self.positiveInt(timing.domainLookupStart - timing.fetchStart),
                dns: self.positiveInt(timing.domainLookupEnd - timing.domainLookupStart), // dns 查询时长
                tcp: self.positiveInt(timing.connectEnd - timing.connectStart), // tcp连接时间
                ssl: 0, // https时长
                ttfb: self.positiveInt(timing.responseStart - timing.requestStart), // TimeToFirstByte
                response: self.positiveInt(timing.responseEnd - timing.responseStart),
                dom1: self.positiveInt(timing.domInteractive - timing.responseEnd), // 可交互 DOM 解析耗时
                dom2: self.positiveInt(timing.domContentLoadedEventStart - timing.domInteractive), // DOM 完全加载耗时
                dcl: self.positiveInt(
                    timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
                ), //
                res: self.positiveInt(timing.loadEventStart - timing.domContentLoadedEventEnd), // 资源加载时间
                onLoad: self.positiveInt(timing.loadEventEnd - timing.loadEventStart),
                // FMP 首次有效绘制
                fpt: self.positiveInt(timing.responseEnd - startTime), // first paint time 白屏
            };

            // http 没有 ssl 阶段，https 才有
            if (timing.secureConnectionStart) {
                stage.ssl = timing.connectEnd - timing.secureConnectionStart;
            }

            // 传输资源大小，用于判断文件是大小是否合适、是否开启了压缩(如 gzip)
            if (timing.transferSize !== undefined) {
                stage.transferSize = timing.transferSize; // 文档 + 头部信息大小
                stage.encodedBodySize = timing.encodedBodySize; // 压缩大小
                stage.decodedBodySize = timing.decodedBodySize; // 解压大小
                // stage.headerSize = positiveInt(timing.transferSize - timing.encodedBodySize) // header头大小
                if (timing.encodedBodySize > 0) {
                    stage.compressionRatio = (
                        timing.decodedBodySize / timing.encodedBodySize
                    ).toFixed(2); // 压缩比率
                }
            }

            if (paint) {
                const [firstPaint, firstContentfulPaint] = paint;
                if (
                    firstPaint &&
                    firstPaint.startTime &&
                    firstContentfulPaint &&
                    firstContentfulPaint.startTime
                ) {
                    stage.fp = firstPaint.startTime.toFixed(2); // 准确的白屏时间
                    stage.fcp = firstContentfulPaint.startTime.toFixed(2); // 准确的灰屏时间
                }
            }

            times = { ...times, ...stage };

            // 计算页面资源
            if (resources) {
                times.resource = this.getResourcePerformance();
            }
            // 页面可交互时间
            // 浏览器不支持performanceObserve时返回 null
            if (tti) {
                times.interactiveTime = tti;
            } else {
                times.interactiveTime = 0;
            }
            const isInValid = Object.keys(times).find((key) => {
                return times[key] > VALID_LIMIT[key];
            });
            return isInValid ? null : times;
        });
    },
    run() {
        try {
            return this.getTimes().then((times) => {
                if (times) {
                    firstScreenTime.run(times); // 首屏时间
                    onPageTime.run(); // 用户停留时间
                }
                return times;
            });
        } catch (e) {
            return Promise.reject(e);
        }
    },
    getResourcePerformance() {
        let resource = {};
        if (window.performance && typeof window.performance.getEntriesByType === 'function') {
            resource = window.performance.getEntriesByType('resource');
        } else if (
            window.performance &&
            typeof window.performance.webkitGetEntriesByType === 'function'
        ) {
            resource = window.performance.webkitGetEntriesByType('resource');
        } else {
            return [];
        }

        const resourceList = [];

        resource.forEach((item) => {
            if (item.initiatorType === 'xmlhttprequest' || item.initiatorType === 'fetchrequest')
                return;

            resourceList.push({
                type: 'resource',
                name: item.name,
                initiatorType: item.initiatorType,
                duration: item.duration.toFixed(2) || 0,
                transferSize: item.transferSize, // 文档 + 头部信息大小
                decodedBodySize: item.decodedBodySize || 0, // 解压文档大小
                encodedBodySize: item.encodedBodySize || 0, // 压缩文档大小
                // headerSize: item.transferSize > 0 ? self.positiveInt(item.transferSize - item.encodedBodySize) : 0, // header头大小
                compressionRatio:
                    item.encodedBodySize > 0
                        ? (item.decodedBodySize / item.encodedBodySize).toFixed(2)
                        : 1, // 压缩比率
                nextHopProtocol: item.nextHopProtocol,
            });
        });
        return resourceList;
    },
};
export default Performance;
