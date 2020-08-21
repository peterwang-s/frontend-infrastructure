import _ from '../utils/index';
import Performance from '../performance/index';
import errorParse from '../parseError/index';
import initExpose from '../exposes/index';
import { EventIdType } from '../utils/const';

const ACTION_MAP = {
    点击: 'C',
    曝光: 'V',
    时长: 'T',
};

class Huami {
    constructor() {
        this.siteId = '';
        this.debug = false;
    }

    bootstrap({ debug, siteId, autoPushErr, autoExpo }) {
        this.siteId = siteId;
        this.debug = debug;
        if (!siteId && debug) {
            _.warn('siteId can not be empty');
        }
        // 第二期 错误统计上报
        if (autoPushErr) {
            //  开启错误事件上报
            errorParse();
        }
        if (autoExpo) {
            initExpose();
        }

        this.autoPushBaseTimes();
    }

    autoPushBaseTimes() {
        const self = this;
        _.nextTick(function () {
            Performance.run().then((data) => {
                _.analyticsCollect2({
                    eventType: EventIdType.PERFORMANCE,
                    siteId: self.siteId,
                    data,
                });
            });
        });
    }

    _trackPageview(data) {
        _.analyticsCollect2({
            eventType: EventIdType.PV,
            siteId: this.siteId,
            data,
        });
    }

    _trackEvent(optionsArr) {
        const options = optionsArr[4];
        const action = ACTION_MAP[optionsArr[2]];
        [, options.tp, , options.n] = optionsArr;
        // options.n = optionsArr[3];

        window.HMAnalyticsCategory = options.tp;

        if (options.opt_value) {
            delete options.opt_value;
        }

        _.analyticsCollect2({
            eventType: EventIdType.COMMON,
            siteId: this.siteId,
            data: options,
            info: { action },
        });
    }

    _trackErr(data) {
        const { debug } = this;
        const errorObj = data[1];

        if (!errorObj && debug) {
            _.warn('error object can not be empty');
        }

        _.analyticsCollect2({
            eventType: EventIdType.JSERROR,
            siteId: this.siteId,
            data: {
                stack: errorObj.stack,
                msg: errorObj.message,
                name: errorObj.name,
            },
        });
    }

    _trackFMP() {
        let startTime;
        const endTime = Date.now();
        const performance = _.isPerformance;
        if (_.isPerformance) {
            const { timing } = performance;
            startTime = timing.navigationStart || timing.fetchStart;
        } else {
            startTime = window.pageStartTime;
        }
        const time = endTime - startTime;
        this.trackFMP(time);
    }

    trackFMP(time) {
        _.analyticsCollect2({
            eventType: EventIdType.PERFORMANCE,
            siteId: this.siteId,
            data: {
                firstMeaningPaint: time,
            },
            info: {
                exp: 'fmp',
            },
        });
    }

    _trackOPT(data, callback) {
        callback();
        _.analyticsCollect2({
            eventType: EventIdType.TIME,
            siteId: this.siteId,
            data,
        });
    }

    _trackBasePerformance(data) {
        _.analyticsCollect2({
            eventType: EventIdType.TIME,
            siteId: this.siteId,
            data,
        });
    }
}
export default Huami;
