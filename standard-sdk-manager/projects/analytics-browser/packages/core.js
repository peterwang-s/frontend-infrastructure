import Config from './config';
import platforms from './platforms/index';
// import performance from './performance'
import _ from './utils/index';
import { URLCHANGEEVENT } from './utils/const';

let instance = null;
const TRACK_VIEW = '_trackPageview'; // pv统计标示
const TRACK_EVENT = '_trackEvent'; // 事件统计标示
const TRACK_FMP = '_trackFMP'; // 首屏时间统计
const TRACK_ERR = '_trackErr'; // 错误统计
// const HUAMI_PLATFORM = 'huami';
let wrapConfig = {};

class Analytics {
    constructor() {
        this.platforms = {};
    }

    init(options) {
        wrapConfig = Config.singleton(options).config;
        this.bootstrap(wrapConfig);
        this.eject(wrapConfig);

        const readyCallbck = wrapConfig.ready;
        readyCallbck && readyCallbck();
    }

    bootstrap(config) {
        for (const platform in config.clients) {
            if (Object.prototype.hasOwnProperty.call(config.clients, platform)) {
                platforms[platform].bootstrap({
                    debug: config.debug,
                    siteId: config.clients[platform],
                    autoPushErr: config.autoPushErr,
                    autoExpo: config.autoExpo,
                });
            }
        }
    }

    eject(config) {
        if (config.autoPushPV) {
            this.autoPushPV();
        }
    }

    _invokeTrack(method, platform, data) {
        // const self = this;
        const dispatcher = platforms[platform];
        if (dispatcher) {
            const func = dispatcher[method];
            func && func.call(dispatcher, data);
        }
    }

    _push(data) {
        const self = this;
        const { clients } = wrapConfig;
        const method = data[0];
        if (method === TRACK_VIEW || method === TRACK_EVENT || method === TRACK_ERR) {
            for (const platform in clients) {
                if (Object.prototype.hasOwnProperty.call(clients, platform)) {
                    self._invokeTrack(method, platform, data);
                }
            }
        }
    }

    push(data) {
        if (!wrapConfig) return;
        // if (wrapConfig.autoPushPV && data[0] === TRACK_VIEW) return;
        if (wrapConfig.autoFMP && data[0] === TRACK_FMP) return;
        this._push(data);
    }

    autoPushPV() {
        const self = this;
        this._push([TRACK_VIEW]);
        if (wrapConfig.isSPA) {
            URLCHANGEEVENT.forEach((event) => {
                _.bind(window, event, function () {
                    self._push([TRACK_VIEW]);
                });
            });
        }
    }

    // autoPushBaseTimes () {
    //   _.nextTick(function () {
    //     performance.run(config)
    //   })
    // }

    ready() {
        const self = this;
        const huamiAnalytics = window.HuamiBrowserAnalytics;
        const cacheConf = huamiAnalytics.config;
        wrapConfig = Config.singleton(cacheConf).config;
        const config = wrapConfig;
        if (!cacheConf.clients) return false;

        self.bootstrap(config);
        self.eject(config);

        const { queue } = huamiAnalytics;
        if (queue.length > 0) {
            queue.forEach(function (data) {
                self.push(data);
            });
        }

        const readyCallbck = config.ready;
        readyCallbck && readyCallbck();
    }

    static singleton() {
        if (!instance) {
            instance = new Analytics();
        }
        return instance;
    }
}

export default Analytics;
