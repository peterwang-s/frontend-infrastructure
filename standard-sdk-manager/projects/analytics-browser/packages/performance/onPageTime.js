import _ from '../utils/index';
// import plaforms from '../platforms/index';
import Config from '../config';

const onPageTime = {
    getOnPageTime() {
        const { config } = Config.singleton();
        const self = this;
        let lock = false;
        const MAX_TIME = 1000 * 60 * 60 * 24 * 3;
        let startDate = window.pageStartTime || Date.now();
        let elapsedTime = 0;

        const _leave = function () {
            lock = true;
            const timeSpent = Date.now() - startDate;
            elapsedTime += timeSpent;
            if (elapsedTime > MAX_TIME) elapsedTime = MAX_TIME;
            self.sendTime({
                time: elapsedTime,
                pos: 0,
                n: document.title,
                tp: window.HMAnalyticsCategory,
            });
            lock = false;
        };

        _.nextTick(function () {
            _.watchPageShow(function () {
                startDate = Date.now();
            });
        });

        _.watchVisibility(
            function show() {
                startDate = Date.now();
            },
            function hide() {
                _.nextTick(function () {
                    if (lock) return;
                    const timeSpent = Date.now() - startDate;
                    elapsedTime += timeSpent;
                });
            },
        );

        if (config.isSPA) {
            _.watchHistory(function () {
                _leave();
            });
        }

        _.watchBeforeUnload(function () {
            _leave();
        });
    },
    sendTime({ time, pos, n, tp }) {
        if (!_.isSendBeacon) {
            window.localStorage.setItem('analytics_opt', JSON.stringify({ time, pos, n, tp }));
        }
        // const huamiAnalytics = plaforms.huami;
        // huamiAnalytics._trackOPT(data, () => {});
        _.trackOPT({ time, pos, n, tp });
    },
    run() {
        const { config } = Config.singleton();
        if (!config.autoOPT) {
            return;
        }
        this.getOnPageTime();
        _.nextTick(function () {
            const data = window.localStorage.getItem('analytics_opt') || '{}';
            const elapsed = JSON.parse(data);
            const { time, pos, n, tp } = elapsed;
            // const huamiAnalytics = plaforms.huami;
            if (elapsed && elapsed.time) {
                _.trackOPT({ time, pos, n, tp }, function () {
                    window.localStorage.removeItem('analytics_opt');
                });
                // huamiAnalytics._trackOPT(elapsed, function () {
                //     window.localStorage.removeItem('analytics_opt');
                // });
            }
        });
    },
};
export default onPageTime;
