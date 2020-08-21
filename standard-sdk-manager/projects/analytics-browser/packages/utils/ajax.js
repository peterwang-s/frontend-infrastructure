import Support from './support';
import Tools from './tools';
import { EventIdType } from './const';
import Config from '../config';

// const errorList = [];
// const reportList = [];

const Ajax = {
    responseLock: false,
    // 第三期 请求方法
    analyticsCollect2({ eventType, data, callback, info, siteId, async = true }) {
        const self = this;
        const { config } = Config.singleton();

        if (!config.namespace && config.debug) {
            _.warn('namespace can not be empty');
        }

        let requestData = {
            c: {
                // usid:Tools.uuid(),  // 开发者不传，服务端默认使用 cookieid
                // uid:Tools.uuid(),
                sv: config.version,
                pf: navigator.platform,
                ds: config.browser.screenSize,
                url: window.location.href,
                // locale: navigator.language,
                // name: navigator.appName,
            },
            app_id: siteId || (config.clients && config.clients.huami),
            e: [],
        };

        switch (eventType) {
            case EventIdType.PV:
                requestData = {
                    ...requestData,
                    e: [
                        {
                            etp: 'cnt', // 语言
                            et: Date.now(),
                            ei: self.eventIdentifierFactory(EventIdType.PV),
                            // ep:{url: location.href}
                        },
                    ],
                };

                break;
            case EventIdType.PERFORMANCE:
                if (!data) {
                    return;
                }
                if (data && data.firstMeaningPaint && info && info.exp === 'fmp') {
                    requestData = {
                        ...requestData,
                        e: [
                            {
                                ep: { ...data },
                                et: Date.now(),
                                etp: 'cal', // 语言
                                ei: self.eventIdentifierFactory(EventIdType.PERFORMANCE, {
                                    exp: 'fmp',
                                }),
                            },
                        ],
                    };
                } else {
                    let edata = [];
                    if (data && data.resource) {
                        edata = data.resource;

                        delete data.resource;
                        edata.unshift(data);
                    }
                    const innerEntity = [];
                    edata.forEach((item) => {
                        if (item.type === 'page') {
                            innerEntity.push({
                                etp: 'cal', // 语言
                                et: Date.now(),
                                ei: self.eventIdentifierFactory(EventIdType.PERFORMANCE, {
                                    exp: 'base',
                                }),
                                ep: { ...item },
                            });
                        } else {
                            innerEntity.push({
                                etp: 'cal', // 语言
                                et: Date.now(),
                                ei: self.eventIdentifierFactory(EventIdType.PERFORMANCE, {
                                    exp: 'resource',
                                }),
                                ep: { ...item },
                            });
                        }
                    });
                    requestData = {
                        ...requestData,
                        e: innerEntity,
                    };
                }
                break;
            case EventIdType.JSERROR:
                requestData = {
                    ...requestData,
                    e: [
                        {
                            etp: 'ex', // 语言
                            et: Date.now(),
                            ei: self.eventIdentifierFactory(EventIdType.JSERROR),
                            ep: data,
                        },
                    ],
                };
                break;
            case EventIdType.EXPOSURE:
                requestData = {
                    ...requestData,
                    e: [
                        {
                            etp: 'cnt', // 语言
                            et: Date.now(),
                            ei: self.eventIdentifierFactory(EventIdType.EXPOSURE),
                            ep: data,
                        },
                    ],
                };
                break;
            case EventIdType.TIME:
                requestData = {
                    ...requestData,
                    e: [
                        {
                            etp: 'cal',
                            et: Date.now(),
                            ei: self.eventIdentifierFactory(EventIdType.TIME),
                            ep: data,
                        },
                    ],
                };

                break;
            case EventIdType.COMMON:
                requestData = {
                    ...requestData,
                    e: [
                        {
                            etp: 'cnt', // 语言
                            et: Date.now(),
                            ei: self.eventIdentifierFactory(EventIdType.COMMON, info),
                            ep: data,
                        },
                    ],
                };
                break;
            default:
        }

        const { host } = config;
        const url = `${host}v5/web/collect`;
        const jsonData = self.packetCell(requestData);

        Tools.nextTick(function () {
            if ('sendBeacon' in navigator) {
                // let url = `http://10.8.3.3:5000/api/v5/web/collect`
                if (navigator.sendBeacon(url, jsonData)) {
                    callback && callback();
                } else {
                    self.imgReuqest2(data, callback);
                }
            } else if (!async) {
                self.baseXhr({ url, parameters: jsonData, callback: () => {} });
            } else {
                self.imgReuqest2(data, callback);
            }
        });
    },
    imgReuqest2(data, callback) {
        const { config } = Config.singleton();
        const url = `${config.host}v5/web/collect`;
        // let url = config.host + 'v2/web/collect'
        // let url = 'http://10.8.3.3:5000/api/v5/web/collect'
        const img = new window.Image(1, 1);
        let args = '';

        const jsonData = {
            et: Date.now(),
            usid: config.usid, // 用户ID
            ct: config.siteId, // 网站标识
            ch: 'h5',
            appName: navigator.appName,
            locale: navigator.language,
        };
        if (data) {
            jsonData.ep = encodeURIComponent(JSON.stringify(data));
        }

        for (const key in jsonData) {
            if ({}.hasOwnProperty.call(jsonData, key)) {
                if (args !== '') {
                    args += '&';
                }
                args += `${key}=${jsonData[key]}`;
            }
        }
        const uid = Tools.uuid();
        img.src = `${url}?${args}&_uid=${uid}`;
        function handleImg() {
            img.onload = null;
            img.onerror = null;
            callback && callback();
        }
        img.onload = handleImg;
        img.onerror = handleImg;
    },
    baseXhr({ url, parameters, callback, async = true }) {
        // const self = this;
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = window.ActiveXObject('Application');
        }
        if (xhr) {
            xhr.open('POST', url, async);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
            if (async) {
                try {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            const result = JSON.parse(xhr.responseText);
                            callback(null, result);
                        } else if (xhr.readyState === 4) {
                            callback(`HTTP request returned ${xhr.status.toString()}`);
                        }
                    };
                    xhr.send(parameters);
                } catch (error) {
                    console.log(error);
                }
            } else {
                try {
                    xhr.send(parameters);
                    if (xhr.status === 200) {
                        const result = JSON.parse(xhr.responseText);
                        return result;
                    }
                    console.log(`HTTP request returned ${xhr.status.toString()}`);
                    return;
                } catch (error) {
                    console.log(error);
                }
            }
        }
    },
    packetCell(jsonObj) {
        try {
            return btoa(encodeURIComponent(JSON.stringify(jsonObj)));
        } catch (error) {
            return null;
        }
    },
    sendBeacon(config, data, callback) {
        const { host } = config;
        const jsonData = JSON.stringify(data);
        const url = `${host}v4/web/collect`;
        if (Support.isSendBeacon) {
            navigator.sendBeacon(url, jsonData);
            callback && callback();
        }
    },
    proxyXhr(afterRequestReturn) {
        const me = this;
        const XhrProto = window.XMLHttpRequest.prototype;
        const oldXhrSend = XhrProto.send;
        XhrProto.send = function () {
            if (me.responseLock) return;
            me.responseLock = true;
            afterRequestReturn();
            return oldXhrSend.apply(this, Tools.slice.call(arguments));
        };
    },
    visibilityGuard() {
        let hidden;
        let visibilityChange;
        if (typeof document.hidden !== 'undefined') {
            hidden = 'hidden';
            visibilityChange = 'visibilitychange';
        } else if (typeof document.msHidden !== 'undefined') {
            hidden = 'msHidden';
            visibilityChange = 'msvisibilitychange';
        } else if (typeof document.webkitHidden !== 'undefined') {
            hidden = 'webkitHidden';
            visibilityChange = 'webkitvisibilitychange';
        }

        function handleVisibilityChange() {
            // 执行上报任务队列
        }

        if (
            typeof document.addEventListener !== 'undefined' &&
            typeof document[hidden] !== 'undefined'
        ) {
            document.addEventListener(visibilityChange, handleVisibilityChange, false);
        }
    },
    unloadGuard() {
        window.addEventListener(
            'unload',
            function () {
                const rumData = new FormData();
                rumData.append('entries', JSON.stringify(performance.getEntries()));
            },
            false,
        );
    },
    eventIdentifierFactory(dataType, info = {}) {
        const { config } = Config.singleton();
        const { action, exp } = info;
        const {
            namespace,
            // pType
        } = config;

        // pid代号（页面名称）_渠道类型_事件名称_页面组件_事件类型
        // pid代号（页面名称）_打点大类
        let idstr = '';
        switch (dataType) {
            case EventIdType.PV: // PV
                idstr = `${namespace}_V`;
                break;
            case EventIdType.PERFORMANCE: // performance
                idstr = `${namespace}_performance${exp ? `_${exp}` : ''}`;
                break;
            case EventIdType.RESOURCE: // performance
                idstr = `${namespace}_resource`;
                break;
            case EventIdType.JSERROR: // jserror
                idstr = `${namespace}_error`;
                break;
            case EventIdType.EXPOSURE: // 曝光
                // idstr =  `${namespace}_H5_${target}_V`
                idstr = `${namespace}_V`;
                break;
            case EventIdType.TIME: // 时间
                idstr = `${namespace}_T`;
                break;
            case EventIdType.COMMON: // common
                idstr = `${namespace}_C`;
                if (action) {
                    idstr = `${namespace}_${action}`;
                }
                // if (action) {
                //     idstr = `${namespace}_${action}`;
                // } else {
                //     idstr = `${namespace}_${name}_${target}_${event}`;
                // }
                break;
            default:
                idstr = `${namespace}_unname`;
        }

        return idstr;
    },
    trackFMP(time) {
        this.analyticsCollect2({
            eventType: EventIdType.PERFORMANCE,
            // siteId: this.siteId,
            data: {
                firstMeaningPaint: time,
            },
            info: {
                exp: 'fmp',
            },
        });
    },
    trackOPT(data, callback) {
        _.analyticsCollect2({
            eventType: EventIdType.TIME,
            siteId: this.siteId,
            data,
        });
        callback();
    },
};
export default Ajax;
